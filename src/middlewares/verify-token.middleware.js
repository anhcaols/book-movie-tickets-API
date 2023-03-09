import { verifyToken } from '../utils/jwt.js';

export const verifyTokenMiddleware = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    verifyToken(token);
    next();
  } catch (e) {
    next(e);
  }
};
