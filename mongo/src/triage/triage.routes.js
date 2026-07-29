import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreateTriage } from '../../middlewares/validation.js';
import { validateUpdateTriageStatus } from '../../middlewares/validate-triage-status.js';
import { requireStaffRole } from '../../middlewares/staff-role.middleware.js';
import { createTriageForm, listTriageForms } from './triage.controller.js';
import { updateTriageStatus } from './triage-status.controller.js';

const router = Router();

router.post('/', validateJWT, validateCreateTriage, createTriageForm);
router.get('/', validateJWT, listTriageForms);
router.patch(
  '/:id/status',
  validateJWT,
  requireStaffRole,
  validateUpdateTriageStatus,
  updateTriageStatus
);

export default router;
