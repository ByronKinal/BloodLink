import { Router } from 'express';
import { askAi } from './ai.controller.js';
import { validateAiAsk } from '../../middlewares/validation.js';

const router = Router();

router.post('/ask', validateAiAsk, askAi);

export default router;
