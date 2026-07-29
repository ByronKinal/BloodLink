import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { listDonationCenters, listUrgentDonationCenters } from './donation-center.controller.js';

const router = Router();

router.get('/urgent', validateJWT, listUrgentDonationCenters);
router.get('/', validateJWT, listDonationCenters);

export default router;
