import express from 'express';
import authRoute from './routes/authRoutes.js';
import checkRoute from './routes/checkRoutes.js';
import reportRoute from './routes/reportRoutes.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/check', checkRoute);
router.use('/report', reportRoute);

// Error handling
router.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'Internal Server Error' });
  } else {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

export default router;
