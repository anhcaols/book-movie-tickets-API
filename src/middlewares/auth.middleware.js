import { AccountModel } from '../models/account.model.js';
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const payload = verifyToken(token);
    const user = await AccountModel.findOne({
      where: {
        email: payload.email,
      },
      attributes: { exclude: ['password'] },
    });
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

export const authMiddlewareWithAdmin = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const payload = verifyToken(token);
    const admin = await AccountModel.findOne({
      where: {
        email: payload.email,
        role: 'admin',
      },
      attributes: { exclude: ['password'] },
    });
    if (!admin) {
      return res.status(401).json({ message: 'You do not have this right' });
    }
    req.admin = admin;
    next();
  } catch (e) {
    next(e);
  }
};
