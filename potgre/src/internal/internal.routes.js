import { Router } from 'express';
import {
  awardDonationPoints,
  awardConfirmationPoints,
  getInternalUserById,
  getInternalUserRoles,
  getInternalUsersByIds,
  getInternalUsersByRole,
  getInternalWallet,
} from './internal.controller.js';

const router = Router();

router.get('/users/batch', getInternalUsersByIds);
router.get('/users/role/:roleName', getInternalUsersByRole);
router.get('/users/:userId/roles', getInternalUserRoles);
router.get('/users/:userId', getInternalUserById);
router.get('/wallets/:userId', getInternalWallet);
router.post('/incentives/award-donation', awardDonationPoints);
router.post('/incentives/award-confirmation', awardConfirmationPoints);

export default router;