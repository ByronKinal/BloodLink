// ================================================================
// RUTAS: Usuarios
// ================================================================

import { Router } from 'express';
import {
  createUserController,
  getUserByIdController,
  getUserByUUIDController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  createOrUpdateProfileController,
  getUserProfileController,
  assignRoleController,
  removeRoleController,
} from './user.controller.js';
import { validateCreateUser, validateUpdateUser, validateCreateProfile } from '../../middlewares/validation.js';
import { validateJWT } from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();

// Usuarios base
router.post('/', validateCreateUser, createUserController);
router.get('/', validateJWT, checkRole(['ADMIN', 'STAFF']), getAllUsersController);
router.get('/:id', validateJWT, checkRole(['ADMIN', 'STAFF']), getUserByIdController);
router.get('/uuid/:uuid', validateJWT, checkRole(['ADMIN', 'STAFF']), getUserByUUIDController);
router.put('/:id', validateJWT, checkRole(['ADMIN', 'STAFF']), validateUpdateUser, updateUserController);
router.delete('/:id', validateJWT, checkRole(['ADMIN', 'STAFF']), deleteUserController);

// Perfiles
router.post('/:id/profile', validateCreateProfile, createOrUpdateProfileController);
router.get('/:id/profile', getUserProfileController);

// Roles
router.post('/:id/roles', assignRoleController);
router.delete('/:id/roles/:roleId', removeRoleController);

export default router;
