import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  updateUserRole,
  getUserRoles,
  getUsersByRole,
  getAllowedRoles,
  updateUserByAdmin,
} from './user.controller.js';
import {
  validateUpdateUserRole,
  validateRoleParam,
  validateAdminUpdateUser,
} from '../../middlewares/validation.js';
import { requireAdminRole } from '../../middlewares/admin-role.middleware.js';

const router = Router();

router.get('/allowed-roles', validateJWT, getAllowedRoles);

router.put('/:userId/role', validateJWT, validateUpdateUserRole, updateUserRole);
router.patch('/:userId', validateJWT, requireAdminRole, validateAdminUpdateUser, updateUserByAdmin);
router.get('/:userId/roles', validateJWT, getUserRoles);
router.get('/by-role/:roleName', validateJWT, validateRoleParam, getUsersByRole);

export default router;