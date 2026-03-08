import { Router } from 'express';
import {
  getCompatibleBloodBags,
  getAllBloodBags,
  getBloodBagsByType,
  getBloodBagById,
  getBloodBagStats,
} from './blood-bag.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateBloodMatchParams } from '../../middlewares/validation.js';

const router = Router();

router.get('/stats', validateJWT, getBloodBagStats);
router.get('/match/:requiredBloodType', validateJWT, validateBloodMatchParams, getCompatibleBloodBags);
router.get('/type/:bloodType', validateJWT, getBloodBagsByType);
router.get('/:id', validateJWT, getBloodBagById);
router.get('/', validateJWT, getAllBloodBags);

export default router;
