import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireAdminRole } from '../../middlewares/admin-role.middleware.js';
import { validateAuditQuery } from '../../middlewares/validation.js';
import { getAuditLogs } from './audit.controller.js';

const router = Router();

router.get('/', validateJWT, requireAdminRole, validateAuditQuery, getAuditLogs);

export default router;
