import crypto from 'crypto';
import { Op } from 'sequelize';
import {
  User,
  UserProfile,
  UserEmail,
  UserPasswordReset,
  UserRefreshToken,
} from '../src/users/user.model.js';
import { Role, UserRole } from '../src/Auth/role.model.js';
import { DONOR_ROLE } from './role-constants.js';
import { hashPassword } from '../utils/password-utils.js';

const USER_RELATIONS = [
  { model: UserProfile, as: 'userProfile' },
  { model: UserEmail, as: 'userEmail' },
  { model: UserPasswordReset, as: 'userPasswordReset' },
  {
    model: UserRole,
    as: 'userRoles',
    include: [{ model: Role, as: 'role' }],
  },
];

const normalize = (value) => (value || '').trim().toLowerCase();

const hashRefreshToken = (refreshToken) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
};

export const findUserByEmailOrUsername = async (emailOrUsername) => {
  const normalized = normalize(emailOrUsername);
  return User.findOne({
    where: {
      [Op.or]: [{ email: normalized }, { username: normalized }],
    },
    include: USER_RELATIONS,
  });
};

export const findUserById = async (userId) => {
  return User.findByPk(userId, {
    include: USER_RELATIONS,
  });
};

export const findUsersByIds = async (userIds = []) => {
  const uniqueUserIds = Array.from(
    new Set((userIds || []).map((id) => String(id || '').trim()).filter(Boolean))
  );

  if (uniqueUserIds.length === 0) {
    return [];
  }

  return User.findAll({
    where: {
      id: {
        [Op.in]: uniqueUserIds,
      },
    },
    include: USER_RELATIONS,
  });
};

export const findUserByEmail = async (email) => {
  return User.findOne({
    where: { email: normalize(email) },
    include: USER_RELATIONS,
  });
};

export const findUserByUsername = async (username) => {
  return User.findOne({
    where: { username: normalize(username) },
  });
};

export const checkUserExists = async (email, username) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: normalize(email) },
        { username: normalize(username) },
      ],
    },
  });

  return Boolean(existingUser);
};

export const createNewUser = async (userData) => {
  const transaction = await User.sequelize.transaction();

  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      phone,
      profilePicture,
      bloodType,
      zone,
      municipality,
    } = userData;
    const hashedPassword = await hashPassword(password);

    const user = await User.create(
      {
        name: name.trim(),
        surname: surname.trim(),
        username: normalize(username),
        email: normalize(email),
        password: hashedPassword,
        status: false,
      },
      { transaction }
    );

    const { getDefaultAvatarPath } = await import('./cloudinary-service.js');

    await UserProfile.create(
      {
        user_id: user.id,
        phone,
        profile_picture: profilePicture || getDefaultAvatarPath(),
        blood_type: String(bloodType || '').trim().toUpperCase(),
        zone: zone ? String(zone).trim() : null,
        municipality: municipality ? String(municipality).trim() : null,
      },
      { transaction }
    );

    await UserEmail.create(
      {
        user_id: user.id,
        email_verified: false,
      },
      { transaction }
    );

    await UserPasswordReset.create(
      {
        user_id: user.id,
      },
      { transaction }
    );

    const defaultRole = await Role.findOne({
      where: { name: DONOR_ROLE },
      transaction,
    });

    if (defaultRole) {
      await UserRole.create(
        {
          user_id: user.id,
          role_id: defaultRole.id,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return findUserById(user.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateEmailVerificationToken = async (
  userId,
  token,
  activationCode,
  expiry
) => {
  await UserEmail.update(
    {
      email_verification_token: token,
      email_verification_code: activationCode,
      email_verification_token_expiry: expiry,
    },
    {
      where: { user_id: userId },
    }
  );
};

export const markEmailAsVerified = async (userId) => {
  const transaction = await User.sequelize.transaction();

  try {
    await UserEmail.update(
      {
        email_verified: true,
        email_verification_token: null,
        email_verification_code: null,
        email_verification_token_expiry: null,
      },
      {
        where: { user_id: userId },
        transaction,
      }
    );

    await User.update(
      {
        status: true,
      },
      {
        where: { id: userId },
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updatePasswordResetToken = async (userId, token, expiry) => {
  await UserPasswordReset.update(
    {
      password_reset_token: token,
      password_reset_token_expiry: expiry,
    },
    {
      where: { user_id: userId },
    }
  );
};

export const updateUserPassword = async (userId, hashedPassword) => {
  const transaction = await User.sequelize.transaction();

  try {
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: userId },
        transaction,
      }
    );

    await UserPasswordReset.update(
      {
        password_reset_token: null,
        password_reset_token_expiry: null,
      },
      {
        where: { user_id: userId },
        transaction,
      }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const findUserByEmailVerificationToken = async (token) => {
  return User.findOne({
    include: [
      {
        model: UserEmail,
        as: 'userEmail',
        where: {
          email_verification_token: token,
          email_verification_token_expiry: {
            [Op.gt]: new Date(),
          },
        },
      },
      ...USER_RELATIONS.filter((relation) => relation.as !== 'userEmail'),
    ],
  });
};

export const findUserByActivationCode = async (email, activationCode) => {
  const normalizedEmail = normalize(email);

  return User.findOne({
    where: { email: normalizedEmail },
    include: [
      {
        model: UserEmail,
        as: 'userEmail',
        where: {
          email_verification_code: activationCode,
          email_verification_token_expiry: {
            [Op.gt]: new Date(),
          },
        },
      },
      ...USER_RELATIONS.filter((relation) => relation.as !== 'userEmail'),
    ],
  });
};

export const findUserByPasswordResetToken = async (token) => {
  return User.findOne({
    include: [
      {
        model: UserPasswordReset,
        as: 'userPasswordReset',
        where: {
          password_reset_token: token,
          password_reset_token_expiry: {
            [Op.gt]: new Date(),
          },
        },
      },
      ...USER_RELATIONS.filter(
        (relation) => relation.as !== 'userPasswordReset'
      ),
    ],
  });
};

export const storeRefreshToken = async (userId, refreshToken, expiresAt) => {
  const tokenHash = hashRefreshToken(refreshToken);

  await UserRefreshToken.create({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  return tokenHash;
};

export const findValidRefreshToken = async (refreshToken) => {
  const tokenHash = hashRefreshToken(refreshToken);

  return UserRefreshToken.findOne({
    where: {
      token_hash: tokenHash,
      revoked_at: null,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
    include: [
      {
        model: User,
        as: 'user',
        include: USER_RELATIONS,
      },
    ],
  });
};

export const revokeRefreshToken = async (refreshToken) => {
  const tokenHash = hashRefreshToken(refreshToken);

  await UserRefreshToken.update(
    {
      revoked_at: new Date(),
    },
    {
      where: {
        token_hash: tokenHash,
        revoked_at: null,
      },
    }
  );
};

export const revokeAllUserRefreshTokens = async (userId) => {
  await UserRefreshToken.update(
    {
      revoked_at: new Date(),
    },
    {
      where: {
        user_id: userId,
        revoked_at: null,
      },
    }
  );
};