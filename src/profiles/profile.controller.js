import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { hashPassword } from '../../utils/password-utils.js';
import Profile from './profile.model.js';

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
  const profile = await Profile.findOne({ userId: String(userId).trim() });

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

  const profile = await Profile.findOne({ userId: String(req.userId).trim() });

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