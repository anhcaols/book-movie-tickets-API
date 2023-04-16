import 'express-async-errors';

import { Router } from 'express';
import {
  createAccountController,
  loginAccountController,
  uploadAvatarController,
  getAccountByAccessTokenController,
  loginAccountByAdminController,
  getUsersController,
  deleteUserController,
  updateUserController,
} from '../controllers/account.controller.js';
import { authMiddleware, authMiddlewareWithAdmin } from '../middlewares/auth.middleware.js';

export const accountRouter = Router();

accountRouter.post('/auth/register', createAccountController);
accountRouter.post('/auth/login', loginAccountController);
accountRouter.post('/admin/auth/login', loginAccountByAdminController);
accountRouter.post('/accounts/upload_avatar', uploadAvatarController);
accountRouter.get('/accounts/info', authMiddleware(), getAccountByAccessTokenController);
accountRouter.get('/accounts', authMiddlewareWithAdmin(), getUsersController);
accountRouter.delete('/accounts/:id', authMiddlewareWithAdmin(), deleteUserController);
accountRouter.patch('/accounts/:id', authMiddlewareWithAdmin(), updateUserController);
