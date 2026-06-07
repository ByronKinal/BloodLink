import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateCreateTriage } from '../../middlewares/validation.js';
import { createTriageForm, listTriageForms } from './triage.controller.js';

const router = Router();

router.post('/', validateJWT, validateCreateTriage, createTriageForm);
router.get('/', validateJWT, listTriageForms);

export default router;
