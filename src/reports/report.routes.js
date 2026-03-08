import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateStockSummaryQuery } from '../../middlewares/validation.js';
import { getStockSummaryReport } from './report.controller.js';

const router = Router();

router.get('/stock-summary', validateJWT, validateStockSummaryQuery, getStockSummaryReport);

export default router;
