import express from 'express';
import { getReporteOperacional, getReporteGestion } from '../controllers/reporteController.js';

const router = express.Router();

router.get('/operacional', getReporteOperacional);
router.get('/gestion', getReporteGestion);

export default router;
