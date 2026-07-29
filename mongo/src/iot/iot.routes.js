import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateIotWeightDonation } from '../../middlewares/validation.js';
import { stockAuditLogger } from '../../middlewares/stock-audit.middleware.js';
import { registerDonationWeight, listDonations } from './iot.controller.js';

const router = Router();

router.post(
  '/weight',
  validateJWT,
  validateIotWeightDonation,
  stockAuditLogger,
  registerDonationWeight
);

router.get(
  '/',
  validateJWT,
  listDonations
);

export default router;
