import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ errors: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decodedData = decodedData;
    next();
  } catch (error) {
    return res.status(400).json({ errors: 'Invalid token' });
  }
};

export default authMiddleware;
