import express from 'express';
import { signUp, login, verify } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/verify', verify);

export default router;
