import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateIotWeightDonation } from '../../middlewares/validation.js';
import { registerDonationWeight } from './iot.controller.js';

const router = Router();

router.post('/weight', validateJWT, validateIotWeightDonation, registerDonationWeight);

export default router;
