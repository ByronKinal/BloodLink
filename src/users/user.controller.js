import { asyncHandler } from '../../middlewares/server-genericError-handler.js';
import { findUserById } from '../../helpers/user-db.js';
import {
  getUserRoleNames,
  getUsersByRole as repoGetUsersByRole,
  setUserSingleRole,
} from '../../helpers/role-db.js';
import {
  ALLOWED_ROLES,
  ADMIN_ROLE,
} from '../../helpers/role-constants.js';
import { buildUserResponse } from '../../utils/user-helpers.js';
import { sequelize } from '../../configs/db.js';

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
    return res.status(403).json({
      success: false,
      message: 'No autorizado. Solo ADMIN_ROLE puede cambiar roles.',
    });
  }

  const { userId } = req.params;
  const { roleName } = req.body || {};
  const normalized = (roleName || '').trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message: 'Rol no permitido.',
      allowedRoles: ALLOWED_ROLES,
    });
  }

  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado',
    });
  }

  const { updatedUser } = await setUserSingleRole(user, normalized, sequelize);

  return res.status(200).json({
    success: true,
    message: 'Rol actualizado exitosamente',
    data: buildUserResponse(updatedUser),
  });
});

export const getUserRoles = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado. Solo ADMIN_ROLE puede consultar roles.',
    });
  }

  const { userId } = req.params;

  const roles = await getUserRoleNames(userId);
  return res.status(200).json({
    success: true,
    data: roles,
  });
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado. Solo ADMIN_ROLE puede consultar por rol.',
    });
  }

  const { roleName } = req.params;
  const normalized = (roleName || '').trim().toUpperCase();

  if (!ALLOWED_ROLES.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message: 'Rol no permitido.',
      allowedRoles: ALLOWED_ROLES,
    });
  }

  const users = await repoGetUsersByRole(normalized);
  return res.status(200).json({
    success: true,
    data: users.map(buildUserResponse),
  });
});

export const getAllowedRoles = asyncHandler(async (req, res) => {
  if (!(await ensureAdmin(req))) {
    return res.status(403).json({
      success: false,
      message: 'No autorizado. Solo ADMIN_ROLE puede consultar roles permitidos.',
    });
  }

  return res.status(200).json({
    success: true,
    data: ALLOWED_ROLES,
  });
});