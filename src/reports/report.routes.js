import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { validateStockSummaryQuery } from '../../middlewares/validation.js';
import { getStockSummaryReport, getMyStatsReport } from './report.controller.js';



const router = Router();

router.get('/stock-summary', validateJWT, validateStockSummaryQuery, getStockSummaryReport);
router.get('/my-stats', validateJWT, getMyStatsReport);

export default router;
