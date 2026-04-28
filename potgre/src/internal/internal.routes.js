import { Router } from 'express';
import {
  awardDonationPoints,
  getInternalUserById,
  getInternalUserRoles,
  getInternalUsersByIds,
  getInternalWallet,
} from './internal.controller.js';

const router = Router();

router.get('/users/batch', getInternalUsersByIds);
router.get('/users/:userId/roles', getInternalUserRoles);
router.get('/users/:userId', getInternalUserById);
router.get('/wallets/:userId', getInternalWallet);
router.post('/incentives/award-donation', awardDonationPoints);

export default router;