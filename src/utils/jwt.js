import { GlobalConfig } from '../config/index.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../api-error.js';
import httpStatus from 'http-status';

export function generateToken(email) {
  const payload = {
    email,
  };
  const accessToken = jwt.sign(payload, `${GlobalConfig.secretKey}`, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign(payload, `${GlobalConfig.secretKey}`, {
    expiresIn: '1h',
  });
  return { accessToken, refreshToken };
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, `${GlobalConfig.secretKey}`);
    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
}
