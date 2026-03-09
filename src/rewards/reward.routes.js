import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateCreateReward,
  validateRedeemReward,
  validateRewardIdParam,
  validateUpdateReward,
} from '../../middlewares/validation.js';
import {
  createRewardController,
  deleteRewardController,
  getRewardByIdController,
  listRewardsController,
  redeemRewardController,
  updateRewardController,
} from './reward.controller.js';

const router = Router();

router.get('/', validateJWT, listRewardsController);
router.get('/:rewardId', validateJWT, validateRewardIdParam, getRewardByIdController);
router.post('/', validateJWT, validateCreateReward, createRewardController);
router.patch('/:rewardId', validateJWT, validateRewardIdParam, validateUpdateReward, updateRewardController);
router.delete('/:rewardId', validateJWT, validateRewardIdParam, deleteRewardController);
router.post('/redeem', validateJWT, validateRedeemReward, redeemRewardController);

export default router;
