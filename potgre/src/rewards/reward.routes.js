import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { upload, handleUploadError } from '../../helpers/file-upload.js';
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
router.post(
  '/',
  validateJWT,
  upload.single('image'),
  handleUploadError,
  validateCreateReward,
  createRewardController
);
router.patch(
  '/:rewardId',
  validateJWT,
  validateRewardIdParam,
  upload.single('image'),
  handleUploadError,
  validateUpdateReward,
  updateRewardController
);
router.delete('/:rewardId', validateJWT, validateRewardIdParam, deleteRewardController);
router.post('/redeem', validateJWT, validateRedeemReward, redeemRewardController);

export default router;
