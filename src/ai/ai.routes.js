import { Router } from 'express';
import { askAi } from './ai.controller.js';
import { validateAiAsk } from '../../middlewares/validation.js';
import { aiRateLimit } from '../../middlewares/request-limit.js';

const router = Router();

router.post('/ask', aiRateLimit, validateAiAsk, askAi);

export default router;
