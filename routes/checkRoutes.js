import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getAllChecks,
  getCheck,
  createCheck,
  updateCheck,
  deleteCheck,
} from '../controllers/checkController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllChecks);
router.get('/:id', getCheck);
router.post('/', createCheck);
router.put('/:id', updateCheck);
router.delete('/:id', deleteCheck);

export default router;
