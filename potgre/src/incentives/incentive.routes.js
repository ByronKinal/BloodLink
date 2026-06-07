import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateWalletUserIdParam } from '../../middlewares/validation.js';
import { getWallet } from './incentive.controller.js';

const router = Router();

router.get('/:userId', validateJWT, validateWalletUserIdParam, getWallet);

export default router;
