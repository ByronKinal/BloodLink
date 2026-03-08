import { Router } from 'express';
import {
  getAllBloodBags,
  getBloodBagsByType,
  getBloodBagById,
  getBloodBagStats,
} from './blood-bag.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.get('/stats', validateJWT, getBloodBagStats);
router.get('/type/:bloodType', validateJWT, getBloodBagsByType);
router.get('/:id', validateJWT, getBloodBagById);
router.get('/', validateJWT, getAllBloodBags);

export default router;
