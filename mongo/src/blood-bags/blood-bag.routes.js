import { Router } from 'express';
import {
  getCompatibleBloodBags,
  getAllBloodBags,
  getBloodBagsByType,
  getBloodBagById,
  getBloodBagStats,
  updateBloodBagStatus,
  createBloodBag,
  updateBloodBag,
  deleteBloodBag,
} from './blood-bag.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateBloodMatchParams,
  validateBloodBagIdParam,
  validateCreateBloodBag,
  validateUpdateBloodBag,
} from '../../middlewares/validation.js';

const router = Router();

router.get('/stats', validateJWT, getBloodBagStats);
router.get('/match/:requiredBloodType', validateJWT, validateBloodMatchParams, getCompatibleBloodBags);
router.get('/type/:bloodType', validateJWT, getBloodBagsByType);
router.post('/', validateJWT, validateCreateBloodBag, createBloodBag);
router.patch('/:id/status', validateJWT, updateBloodBagStatus);
router.put('/:id', validateJWT, validateBloodBagIdParam, validateUpdateBloodBag, updateBloodBag);
router.delete('/:id', validateJWT, validateBloodBagIdParam, deleteBloodBag);
router.get('/:id', validateJWT, getBloodBagById);
router.get('/', validateJWT, getAllBloodBags);

export default router;
