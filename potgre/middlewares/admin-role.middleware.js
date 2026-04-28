import { ADMIN_ROLE } from '../helpers/role-constants.js';
import { getUserRoleNames } from '../helpers/role-db.js';

export const requireAdminRole = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Usuario no autenticado.',
      });
    }

    const roleNamesFromToken = req.user?.userRoles
      ?.map((userRole) => userRole.role?.name)
      .filter(Boolean);

    const roleNames =
      roleNamesFromToken && roleNamesFromToken.length > 0
        ? roleNamesFromToken
        : await getUserRoleNames(req.userId);

    if (!roleNames.includes(ADMIN_ROLE)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado. Solo ADMIN_ROLE puede acceder a este recurso.',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
