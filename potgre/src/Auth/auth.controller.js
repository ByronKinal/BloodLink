import {
  registerUserHelper,
  loginUserHelper,
  refreshAccessTokenHelper,
  verifyEmailHelper,
  resendVerificationEmailHelper,
  forgotPasswordHelper,
  resetPasswordHelper,
  logoutUserHelper,
} from '../../helpers/auth-operations.js';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

const toApiSuccess = (result, defaultMessage = 'Operación exitosa') => {
  const payload = result && typeof result === 'object' ? { ...result } : {};
  delete payload.success;
  const message = payload.message || defaultMessage;
  delete payload.message;
  const data = Object.keys(payload).length > 0 ? payload : null;

  return ApiResponse.success(data, message);
};

export const register = asyncHandler(async (req, res) => {
  try {
    const result = await registerUserHelper(req.body, req.file);
    return res.status(201).json(toApiSuccess(result, 'Usuario registrado exitosamente'));
  } catch (error) {
    let statusCode = 400;
    if (error.message.includes('Ya existe un usuario')) {
      statusCode = 409;
    }

    return res
      .status(statusCode)
      .json(ApiResponse.error(error.message || 'Error en el registro'));
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await loginUserHelper(emailOrUsername, password);

    return res.status(200).json(toApiSuccess(result, 'Login exitoso'));
  } catch (error) {
    let statusCode = 401;
    if (
      error.message.includes('desactivada') ||
      error.message.includes('verificar tu email')
    ) {
      statusCode = 423;
    }

    return res
      .status(statusCode)
      .json(ApiResponse.error(error.message || 'Error en el login'));
  }
});

export const refreshToken = asyncHandler(async (req, res) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;
    const result = await refreshAccessTokenHelper(incomingRefreshToken);

    return res.status(200).json(toApiSuccess(result, 'Token renovado exitosamente'));
  } catch (error) {
    return res
      .status(401)
      .json(ApiResponse.error(error.message || 'No se pudo renovar el token'));
  }
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken: incomingRefreshToken } = req.body;
  const result = await logoutUserHelper(incomingRefreshToken);

  return res.status(200).json(toApiSuccess(result, 'Sesión cerrada exitosamente'));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token, email, activationCode } = req.body;
    const result = await verifyEmailHelper({ token, email, activationCode });

    return res.status(200).json(toApiSuccess(result, 'Email verificado exitosamente'));
  } catch (error) {
    let statusCode = 400;
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
    } else if (
      error.message.includes('inválido') ||
      error.message.includes('expirado')
    ) {
      statusCode = 401;
    }

    return res
      .status(statusCode)
      .json(ApiResponse.error(error.message || 'Error en la verificación de email'));
  }
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await resendVerificationEmailHelper(email);

  if (!result.success) {
    if (result.message.includes('no encontrado')) {
      return res.status(404).json(ApiResponse.error(result.message, result.data || null));
    }

    if (result.message.includes('ya ha sido verificado')) {
      return res.status(400).json(ApiResponse.error(result.message, result.data || null));
    }

    return res.status(503).json(ApiResponse.error(result.message, result.data || null));
  }

  return res.status(200).json(toApiSuccess(result, 'Email de verificación reenviado exitosamente'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPasswordHelper(email);

  return res
    .status(200)
    .json(toApiSuccess(result, 'Proceso de recuperación iniciado'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordHelper(token, newPassword);

    return res.status(200).json(toApiSuccess(result, 'Contraseña actualizada exitosamente'));
  } catch (error) {
    let statusCode = 400;
    if (error.message.includes('no encontrado')) {
      statusCode = 404;
    } else if (
      error.message.includes('inválido') ||
      error.message.includes('expirado')
    ) {
      statusCode = 401;
    }

    return res
      .status(statusCode)
      .json(ApiResponse.error(error.message || 'Error al restablecer contraseña'));
  }
});
