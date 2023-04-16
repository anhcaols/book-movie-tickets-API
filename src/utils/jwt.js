import { GlobalConfig } from '../config/index.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../api-error.js';
import httpStatus from 'http-status';

export function generateToken(email, isAdmin) {
  const payload = {
    email,
    isAdmin,
  };

  const accessToken = jwt.sign(payload, `${GlobalConfig.secretKey}`, {
    expiresIn: '10h',
  });

  const refreshToken = jwt.sign(payload, `${GlobalConfig.secretKey}`, {
    expiresIn: '10h',
  });
  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, `${GlobalConfig.secretKey}`);
    if (!payload) {
      return res.status(401).send('Unauthorized request');
    }
    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
}
