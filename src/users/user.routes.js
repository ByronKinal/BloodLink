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

const router = Router();

// Usuarios base
router.post('/', validateCreateUser, createUserController);
router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.get('/uuid/:uuid', getUserByUUIDController);
router.put('/:id', validateUpdateUser, updateUserController);
router.delete('/:id', deleteUserController);

// Perfiles
router.post('/:id/profile', validateCreateProfile, createOrUpdateProfileController);
router.get('/:id/profile', getUserProfileController);

// Roles
router.post('/:id/roles', assignRoleController);
router.delete('/:id/roles/:roleId', removeRoleController);

export default router;
