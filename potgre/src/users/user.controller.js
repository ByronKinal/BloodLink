import { asyncHandler } from '../../middlewares/errorHandler.js';
import { findUserById } from '../../helpers/user-db.js';
import { createNewUser, markEmailAsVerified } from '../../helpers/user-db.js';
import {
  getUserRoleNames,
  getUsersByRole as repoGetUsersByRole,
  setUserSingleRole,
} from '../../helpers/role-db.js';
import {
  ALLOWED_ROLES,
  ADMIN_ROLE,
  DONOR_ROLE,
  STAFF_ROLE,
} from '../../helpers/role-constants.js';
import { buildUserResponse } from '../../utils/user-helpers.js';
import { sequelize } from '../../configs/db.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { User, UserProfile } from './user.model.js';
import { createMongoProfile } from '../../helpers/MongoServiceClient.js';
import { uploadImage, deleteImage } from '../../helpers/cloudinary-service.js';
import { FileValidator } from '../../helpers/file-validator.js';

const ensureAdmin = async (req) => {
  const currentUserId = req.userId;

  if (!currentUserId) {
    return false;
  }

  const roleNamesFromToken = req.user?.userRoles
    ?.map((userRole) => userRole.role?.name)
    .filter(Boolean);

  const roleNames =
    roleNamesFromToken && roleNamesFromToken.length > 0
      ? roleNamesFromToken
      : await getUserRoleNames(currentUserId);

  return roleNames.includes(ADMIN_ROLE);
};

export const updateUserRole = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo ADMIN_ROLE puede cambiar roles.'));
  }

  const { userId } = req.params;
  const { roleName } = req.body || {};
  const normalized = (roleName || '').trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalized)) {
    return res
      .status(400)
      .json(ApiResponse.error('Rol no permitido.', { allowedRoles: ALLOWED_ROLES }));
  }

  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
  }

  const targetRoles = (user.userRoles || [])
    .map((ur) => ur.role?.name)
    .filter(Boolean);

  const isSelfUpdate = req.userId === userId;
  const targetIsAdmin = targetRoles.includes(ADMIN_ROLE);

  if (targetIsAdmin && !isSelfUpdate) {
    return res.status(403).json(
      ApiResponse.error(
        'Este usuario ya tiene ADMIN_ROLE y su rol no se puede modificar nuevamente.'
      )
    );
  }

  const { updatedUser } = await setUserSingleRole(user, normalized, sequelize);

  return res
    .status(200)
    .json(
      ApiResponse.success(buildUserResponse(updatedUser), 'Rol actualizado exitosamente')
    );
});

export const getUserRoles = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo ADMIN_ROLE puede consultar roles.'));
  }

  const { userId } = req.params;

  const roles = await getUserRoleNames(userId);
  return res.status(200).json(ApiResponse.success(roles, 'Roles obtenidos exitosamente'));
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo ADMIN_ROLE puede consultar por rol.'));
  }

  const { roleName } = req.params;
  const normalized = (roleName || '').trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalized)) {
    return res
      .status(400)
      .json(ApiResponse.error('Rol no permitido.', { allowedRoles: ALLOWED_ROLES }));
  }

  const users = await repoGetUsersByRole(normalized);
  return res
    .status(200)
    .json(
      ApiResponse.success(users.map(buildUserResponse), 'Usuarios obtenidos exitosamente')
    );
});

export const getAllowedRoles = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(
        ApiResponse.error(
          'No autorizado. Solo ADMIN_ROLE puede consultar roles permitidos.'
        )
      );
  }

  return res
    .status(200)
    .json(ApiResponse.success(ALLOWED_ROLES, 'Roles permitidos obtenidos exitosamente'));
});

export const createUserByAdmin = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo ADMIN_ROLE puede crear usuarios.'));
  }

  const {
    name,
    surname,
    username,
    email,
    password,
    phone,
    bloodType,
    zone,
    municipality,
    roleName,
  } = req.body || {};

  const normalizedRole = (roleName || DONOR_ROLE).trim().toUpperCase();

  const createdUser = await createNewUser({
    name,
    surname,
    username,
    email,
    password,
    phone,
    bloodType,
    zone,
    municipality,
    profilePicture: null,
  });

  await markEmailAsVerified(createdUser.id);

  // Disparar la creación de perfil en Mongo de forma asíncrona
  createMongoProfile({
    userId: createdUser.id,
    roleName: normalizedRole,
    email: createdUser.email,
    passwordHash: createdUser.password,
    bloodType: bloodType || 'O+',
  }).then((res) => {
    if (res.success) {
      console.log(`[Mongo Profile] Perfil médico creado para ${createdUser.id} por admin`);
    } else {
      console.warn(`[Mongo Profile] No se pudo crear el perfil médico desde admin: ${res.message}`);
    }
  }).catch((err) => {
    console.error('[Mongo Profile] Error al disparar creación de perfil desde admin:', err);
  });

  if (normalizedRole !== DONOR_ROLE) {
    const { updatedUser } = await setUserSingleRole(createdUser, normalizedRole, sequelize);
    return res
      .status(201)
      .json(ApiResponse.success(buildUserResponse(updatedUser), 'Usuario creado exitosamente'));
  }

  const refreshedUser = await findUserById(createdUser.id);

  return res
    .status(201)
    .json(ApiResponse.success(buildUserResponse(refreshedUser), 'Usuario creado exitosamente'));
});

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const isSelfEdit = req.userId === userId;
  const isAdmin = await ensureAdmin(req);

  if (!isAdmin && !isSelfEdit) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo puedes editar tu propia información o debes ser administrador.'));
  }

  const targetUser = await findUserById(userId);

  if (!targetUser) {
    return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
  }

  const targetRoles = (targetUser.userRoles || [])
    .map((ur) => ur.role?.name)
    .filter(Boolean);

  if (targetRoles.includes(ADMIN_ROLE) && !isSelfEdit) {
    return res
      .status(403)
      .json(ApiResponse.error('No puedes editar a otros usuarios con ADMIN_ROLE'));
  }

  const canBeManaged =
    targetRoles.includes(DONOR_ROLE) || targetRoles.includes(STAFF_ROLE);

  if (!canBeManaged && !isSelfEdit) {
    return res
      .status(403)
      .json(ApiResponse.error('Solo se pueden editar usuarios DONOR_ROLE o STAFF_ROLE'));
  }

  const {
    name,
    surname,
    phone,
    zone,
    municipality,
    status,
  } = req.body || {};

  let uploadedProfilePicture;
  if (req.file) {
    const fileValidation = FileValidator.validateImage(req.file);
    if (!fileValidation.isValid) {
      return res.status(400).json(ApiResponse.error(fileValidation.errorMessage || 'Archivo de imagen inválido'));
    }

    const secureFileName = FileValidator.generateSecureFileName(
      req.file.originalname
    );
    uploadedProfilePicture = await uploadImage(
      req.file.path,
      secureFileName
    );
  }

  try {
    await sequelize.transaction(async (transaction) => {
      const userUpdates = {};
      const profileUpdates = {};

      if (typeof name === 'string') {
        userUpdates.name = name.trim();
      }

      if (typeof surname === 'string') {
        userUpdates.surname = surname.trim();
      }

      if (typeof status === 'boolean') {
        userUpdates.status = status;
      }

      if (typeof phone === 'string') {
        profileUpdates.phone = phone.trim();
      }

      if (typeof zone === 'string') {
        profileUpdates.zone = zone.trim();
      }

      if (typeof municipality === 'string') {
        profileUpdates.municipality = municipality.trim();
      }

      if (uploadedProfilePicture) {
        profileUpdates.profile_picture = uploadedProfilePicture;
      }

      if (Object.keys(userUpdates).length > 0) {
        await User.update(userUpdates, {
          where: { id: userId },
          transaction,
        });
      }

      if (Object.keys(profileUpdates).length > 0) {
        const profile = await UserProfile.findOne({
          where: { user_id: userId },
          transaction,
        });

        if (!profile) {
          const error = new Error('Perfil de usuario no encontrado para actualizar');
          error.status = 409;
          throw error;
        }

        await UserProfile.update(profileUpdates, {
          where: { user_id: userId },
          transaction,
        });
      }
    });

    if (uploadedProfilePicture && targetUser.userProfile?.profile_picture) {
      await deleteImage(targetUser.userProfile.profile_picture);
    }
  } catch (error) {
    if (uploadedProfilePicture) {
      await deleteImage(uploadedProfilePicture);
    }
    return res.status(error.status || 500).json(ApiResponse.error(error.message || 'Error al actualizar el usuario'));
  }

  const updatedUser = await findUserById(userId);

  return res
    .status(200)
    .json(ApiResponse.success(buildUserResponse(updatedUser), 'Usuario actualizado exitosamente'));
});