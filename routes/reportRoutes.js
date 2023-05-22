import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getReportByCheckId,
  getReportsByTags,
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/tags', authMiddleware, getReportsByTags);
router.get('/:id', authMiddleware, getReportByCheckId);

export default router;
