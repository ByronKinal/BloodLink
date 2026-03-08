import { asyncHandler } from '../../middlewares/errorHandler.js';
import { findUserById } from '../../helpers/user-db.js';
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

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res
      .status(403)
      .json(ApiResponse.error('No autorizado. Solo ADMIN_ROLE puede editar usuarios.'));
  }

  const { userId } = req.params;
  const targetUser = await findUserById(userId);

  if (!targetUser) {
    return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
  }

  const targetRoles = (targetUser.userRoles || [])
    .map((ur) => ur.role?.name)
    .filter(Boolean);

  const isSelfEdit = req.userId === userId;

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

  const updatedUser = await findUserById(userId);

  return res
    .status(200)
    .json(ApiResponse.success(buildUserResponse(updatedUser), 'Usuario actualizado exitosamente'));
});