import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import Profile from '../profiles/profile.model.js';

export const createInternalProfile = asyncHandler(async (req, res) => {
  const { userId, roleName, email, passwordHash, bloodType } = req.body;

  if (!userId || !roleName || !email || !passwordHash) {
    return res.status(400).json({
      success: false,
      message: 'userId, roleName, email y passwordHash son requeridos',
    });
  }

  // Verificar si el perfil ya existe en MongoDB
  const existingProfile = await Profile.findOne({ userId });
  if (existingProfile) {
    return res.status(200).json({
      success: true,
      message: 'El perfil ya existe en MongoDB',
      data: existingProfile,
    });
  }

  // Crear el perfil
  const profile = await Profile.create({
    userId: String(userId).trim(),
    roleName: String(roleName).trim().toUpperCase(),
    email: String(email).trim().toLowerCase(),
    passwordHash: String(passwordHash),
    donorData: roleName === 'DONOR_ROLE' && bloodType ? { bloodType: String(bloodType).trim().toUpperCase() } : undefined,
  });

  return res.status(201).json({
    success: true,
    message: 'Perfil creado internamente en MongoDB exitosamente',
    data: profile,
  });
});
