import 'express-async-errors';

import { Router } from 'express';
import {
  createAccountController,
  loginAccountController,
  logoutAccountController,
  uploadAvatarController,
  test,
  getAccountByAccessTokenController,
} from '../controllers/account.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const accountRouter = Router();

accountRouter.post('/auth/register', createAccountController);
accountRouter.post('/auth/login', loginAccountController);
accountRouter.post('/auth/logout', logoutAccountController);
accountRouter.post('/accounts/upload_avatar', uploadAvatarController);
accountRouter.get('/accounts/info', authMiddleware(), getAccountByAccessTokenController);
accountRouter.get('/test', authMiddleware(), test);
