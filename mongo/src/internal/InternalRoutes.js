import { Router } from 'express';
import { createInternalProfile } from './InternalController.js';

const router = Router();

router.post('/profiles', createInternalProfile);

export default router;
