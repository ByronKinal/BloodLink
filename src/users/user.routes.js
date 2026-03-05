import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  updateUserRole,
  getUserRoles,
  getUsersByRole,
  getAllowedRoles,
} from './user.controller.js';
import {
  validateUpdateUserRole,
  validateRoleParam,
} from '../../middlewares/validation.js';

const router = Router();

router.get('/allowed-roles', validateJWT, getAllowedRoles);

router.put('/:userId/role', validateJWT, validateUpdateUserRole, updateUserRole);
router.get('/:userId/roles', validateJWT, getUserRoles);
router.get('/by-role/:roleName', validateJWT, validateRoleParam, getUsersByRole);

export default router;