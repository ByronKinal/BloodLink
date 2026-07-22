import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { hashPassword } from '../../utils/password-utils.js';
import Profile from './profile.model.js';
import { DONOR_ROLE } from '../../helpers/role-constants.js';
import { findUserById } from '../../helpers/user-db.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

const sanitizeProfile = (profile) => {
  if (!profile) {
    return null;
  }

  return {
    id: profile._id,
    userId: profile.userId,
    roleName: profile.roleName,
    email: profile.email,
    donorData: profile.donorData || null,
    staffData: profile.staffData || null,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};

const normalizeRoleName = (req) => {
  const roleFromToken = req.userRole;
  const roleFromDb = req.user?.userRoles?.[0]?.role?.name;
  return String(roleFromToken || roleFromDb || DONOR_ROLE)
    .trim()
    .toUpperCase();
};

const buildDonorDataFromSqlUser = (req) => {
  const roleName = normalizeRoleName(req);
  if (roleName !== DONOR_ROLE) {
    return undefined;
  }

  const bloodType = req.user?.userProfile?.blood_type;
  if (!bloodType) {
    return undefined;
  }

  return {
    bloodType: String(bloodType).trim().toUpperCase(),
  };
};

const buildFallbackProfileFromSqlUser = (req) => {
  const userId = String(req.userId || '').trim();
  const roleName = normalizeRoleName(req);
  const email = String(req.user?.email || '').trim().toLowerCase();

  if (!userId || !email) {
    return null;
  }

  return {
    _id: `fallback-${userId}`,
    userId,
    roleName,
    email,
    donorData: buildDonorDataFromSqlUser(req) || null,
    staffData: null,
    createdAt: req.user?.created_at || new Date(),
    updatedAt: req.user?.updated_at || new Date(),
  };
};

const normalizeRoleNameFromUser = (user) => {
  const roleFromDb = user?.userRoles?.[0]?.role?.name;
  return String(roleFromDb || DONOR_ROLE)
    .trim()
    .toUpperCase();
};

const buildDonorDataFromUser = (user, roleName) => {
  if (roleName !== DONOR_ROLE) {
    return undefined;
  }

  const bloodType = user?.userProfile?.blood_type;
  if (!bloodType) {
    return undefined;
  }

  return {
    bloodType: String(bloodType).trim().toUpperCase(),
  };
};

const buildFallbackProfileFromUser = (user) => {
  const userId = String(user?.id || '').trim();
  const roleName = normalizeRoleNameFromUser(user);
  const email = String(user?.email || '').trim().toLowerCase();

  if (!userId || !email) {
    return null;
  }

  return {
    _id: `fallback-${userId}`,
    userId,
    roleName,
    email,
    donorData: buildDonorDataFromUser(user, roleName) || null,
    staffData: null,
    createdAt: user?.created_at || new Date(),
    updatedAt: user?.updated_at || new Date(),
  };
};

const ensureProfileForSqlUser = async (user) => {
  const userId = String(user?.id || '').trim();
  if (!userId) {
    return null;
  }

  const existing = await Profile.findOne({ userId });
  if (existing) {
    return existing;
  }

  const roleName = normalizeRoleNameFromUser(user);
  const email = String(user?.email || '').trim().toLowerCase();
  const passwordHash = user?.password;

  if (!email || !passwordHash) {
    return buildFallbackProfileFromUser(user);
  }

  try {
    return await Profile.create({
      userId,
      roleName,
      email,
      passwordHash,
      donorData: buildDonorDataFromUser(user, roleName),
    });
  } catch (_error) {
    const afterFailure = await Profile.findOne({ userId });
    return afterFailure || buildFallbackProfileFromUser(user);
  }
};

const ensureMyProfile = async (req) => {
  const userId = String(req.userId || '').trim();
  if (!userId) {
    return null;
  }

  const existing = await Profile.findOne({ userId });
  if (existing) {
    return existing;
  }

  const roleName = normalizeRoleName(req);
  const email = String(req.user?.email || '').trim().toLowerCase();
  const passwordHash = req.user?.password;

  if (!email || !passwordHash) {
    return buildFallbackProfileFromSqlUser(req);
  }

  try {
    return await Profile.create({
      userId,
      roleName,
      email,
      passwordHash,
      donorData: buildDonorDataFromSqlUser(req),
    });
  } catch (_error) {
    // If profile provisioning fails, keep endpoint available with SQL-backed data.
    const afterFailure = await Profile.findOne({ userId });
    return afterFailure || buildFallbackProfileFromSqlUser(req);
  }
};

export const createProfile = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no está conectado',
    });
  }

  const { userId, roleName, email, password, donorData, staffData } = req.body;

  if (req.userId && req.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado para crear perfil de otro usuario',
    });
  }

  const passwordHash = await hashPassword(password);

  const profile = await Profile.create({
    userId: String(userId).trim(),
    roleName,
    email,
    passwordHash,
    donorData,
    staffData,
  });

  return res.status(201).json({
    success: true,
    message: 'Perfil creado correctamente',
    data: sanitizeProfile(profile),
  });
});

export const getProfileByUserId = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no está conectado',
    });
  }

  const { userId } = req.params;
  const normalizedUserId = String(userId).trim();

  let profile = await Profile.findOne({ userId: normalizedUserId });

  if (!profile) {
    const targetUser = await findUserById(normalizedUserId);
    if (targetUser) {
      profile = await ensureProfileForSqlUser(targetUser);
    }
  }

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    data: sanitizeProfile(profile),
  });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB no está conectado',
    });
  }

  const profile = await ensureMyProfile(req);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado',
    });
  }

  return res.status(200).json({
    success: true,
    data: sanitizeProfile(profile),
  });
});