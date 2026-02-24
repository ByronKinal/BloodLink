import express from 'express';
import { createUser, getUsers, updateUser } from './user.controller.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/users', checkRole(['ADMIN', 'STAFF']), createUser);

router.get('/users', checkRole(['ADMIN', 'STAFF']), getUsers);

router.put('/users/:id', checkRole(['ADMIN', 'STAFF']), updateUser);

export default router;