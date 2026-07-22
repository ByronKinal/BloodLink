import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  createProfile,
  getMyProfile,
  getProfileByUserId,
} from './profile.controller.js';
import { validateCreateProfile } from '../../middlewares/profile.validation.js';

const router = Router();

router.post('/', validateJWT, validateCreateProfile, createProfile);
router.get('/me', validateJWT, getMyProfile);
router.get('/user/:userId', validateJWT, getProfileByUserId);

export default router;