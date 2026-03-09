import { config } from '../configs/config.js';
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateActivationCode,
} from '../utils/auth-helpers.js';
import {
  verifyPassword,
  validatePasswordStrength,
  hashPassword,
} from '../utils/password-utils.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
} from './email-service.js';
import {
  generateTokenPair,
  verifyRefreshToken,
  getExpirationTimeInMs,
} from './generate-jwt.js';
import {
  checkUserExists,
  createNewUser,
  findUserByEmailOrUsername,
  updateEmailVerificationToken,
  markEmailAsVerified,
  findUserByEmail,
  updatePasswordResetToken,
  updateUserPassword,
  findUserByEmailVerificationToken,
  findUserByActivationCode,
  findUserByPasswordResetToken,
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from './user-db.js';
import { DONOR_ROLE } from './role-constants.js';

const buildTokenResponse = async (user) => {
  const role = user.userRoles?.[0]?.role?.name || DONOR_ROLE;
  const { accessToken, refreshToken } = await generateTokenPair(user.id, { role });

  const refreshExpiresMs = getExpirationTimeInMs(
    config.jwt.refreshExpiresIn,
    7 * 24 * 60 * 60 * 1000
  );
  await storeRefreshToken(
    user.id,
    refreshToken,
    new Date(Date.now() + refreshExpiresMs)
  );

  const accessExpiresMs = getExpirationTimeInMs(config.jwt.expiresIn);
  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresAt: new Date(Date.now() + accessExpiresMs),
  };
};

export const registerUserHelper = async (userData) => {
  const { email, username, password, name } = userData;

  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join('. '));
  }

  const userExists = await checkUserExists(email, username);
  if (userExists) {
    throw new Error('Ya existe un usuario con este email o nombre de usuario');
  }

  const newUser = await createNewUser(userData);

  const verificationToken = generateEmailVerificationToken();
  const activationCode = generateActivationCode();
  const tokenExpiry = new Date(Date.now() + config.verification.emailTokenExpiry);

  await updateEmailVerificationToken(
    newUser.id,
    verificationToken,
    activationCode,
    tokenExpiry
  );

  Promise.resolve()
    .then(() =>
      sendVerificationEmail(email.toLowerCase(), name, verificationToken, activationCode)
    )
    .catch((error) => {
      console.error('Async email send (verification) failed:', error);
    });

  return {
    success: true,
    user: buildUserResponse(newUser),
    message:
      'Usuario registrado exitosamente. Revisa tu correo para activar la cuenta.',
    emailVerificationRequired: true,
  };
};

export const loginUserHelper = async (emailOrUsername, password) => {
  const user = await findUserByEmailOrUsername(emailOrUsername);

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isValidPassword = await verifyPassword(user.password, password);
  if (!isValidPassword) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.userEmail?.email_verified) {
    throw new Error(
      'Debes verificar tu email antes de iniciar sesión. Puedes solicitar reenvío del código.'
    );
  }

  if (!user.status) {
    throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
  }

  const tokens = await buildTokenResponse(user);
  const profile = buildUserResponse(user);

  return {
    success: true,
    message: 'Login exitoso',
    ...tokens,
    userDetails: {
      id: profile.id,
      username: profile.username,
      profilePicture: profile.profilePicture,
      role: profile.role,
    },
  };
};

export const refreshAccessTokenHelper = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token requerido');
  }

  await verifyRefreshToken(refreshToken);

  const storedToken = await findValidRefreshToken(refreshToken);
  if (!storedToken || !storedToken.user) {
    throw new Error('Refresh token inválido o expirado');
  }

  const user = storedToken.user;
  if (!user.status) {
    throw new Error('Cuenta desactivada. Contacta al administrador.');
  }

  if (!user.userEmail?.email_verified) {
    throw new Error('Debes verificar tu email antes de renovar sesión.');
  }

  await revokeRefreshToken(refreshToken);
  const tokens = await buildTokenResponse(user);

  return {
    success: true,
    message: 'Token renovado exitosamente',
    ...tokens,
  };
};

export const logoutUserHelper = async (refreshToken) => {
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  return {
    success: true,
    message: 'Sesión cerrada exitosamente',
  };
};

export const verifyEmailHelper = async ({ token, email, activationCode }) => {
  if (!token && (!email || !activationCode)) {
    throw new Error(
      'Debes enviar token de verificación o email + código de activación'
    );
  }

  const user = token
    ? await findUserByEmailVerificationToken(token)
    : await findUserByActivationCode(email, String(activationCode).trim());

  if (!user) {
    throw new Error('Usuario no encontrado o token/código inválido');
  }

  if (user.userEmail?.email_verified) {
    throw new Error('El email ya ha sido verificado');
  }

  await markEmailAsVerified(user.id);

  Promise.resolve()
    .then(() => sendWelcomeEmail(user.email, user.name))
    .catch((error) => {
      console.error('Async email send (welcome) failed:', error);
    });

  return {
    success: true,
    message: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
    data: {
      email: user.email,
      verified: true,
    },
  };
};

export const resendVerificationEmailHelper = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: 'Usuario no encontrado',
      data: { email, sent: false },
    };
  }

  if (user.userEmail?.email_verified) {
    return {
      success: false,
      message: 'El email ya ha sido verificado',
      data: { email: user.email, verified: true },
    };
  }

  const verificationToken = generateEmailVerificationToken();
  const activationCode = generateActivationCode();
  const tokenExpiry = new Date(Date.now() + config.verification.emailTokenExpiry);

  await updateEmailVerificationToken(
    user.id,
    verificationToken,
    activationCode,
    tokenExpiry
  );

  try {
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken,
      activationCode
    );

    return {
      success: true,
      message: 'Email de verificación reenviado exitosamente',
      data: { email: user.email, sent: true },
    };
  } catch (error) {
    console.error('Error sending verification email:', error);

    return {
      success: false,
      message:
        'No se pudo reenviar el email de verificación. Inténtalo más tarde.',
      data: { email: user.email, sent: false },
    };
  }
};

export const forgotPasswordHelper = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: true,
      message: 'Si el email existe, se ha enviado un enlace de recuperación',
      data: { email, initiated: true },
    };
  }

  const resetToken = generatePasswordResetToken();
  const tokenExpiry = new Date(Date.now() + config.verification.passwordResetExpiry);

  await updatePasswordResetToken(user.id, resetToken, tokenExpiry);

  Promise.resolve()
    .then(() => sendPasswordResetEmail(user.email, user.name, resetToken))
    .catch((error) => {
      console.error('Failed to send password reset email:', error);
    });

  return {
    success: true,
    message: 'Si el email existe, se ha enviado un enlace de recuperación',
    data: { email, initiated: true },
  };
};

export const resetPasswordHelper = async (token, newPassword) => {
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join('. '));
  }

  const user = await findUserByPasswordResetToken(token);
  if (!user) {
    throw new Error('Usuario no encontrado o token inválido');
  }

  const hashedPassword = await hashPassword(newPassword);
  await updateUserPassword(user.id, hashedPassword);
  await revokeAllUserRefreshTokens(user.id);

  Promise.resolve()
    .then(() => sendPasswordChangedEmail(user.email, user.name))
    .catch((error) => {
      console.error('Error sending password changed email:', error);
    });

  return {
    success: true,
    message: 'Contraseña actualizada exitosamente',
    data: { email: user.email, reset: true },
  };
};
