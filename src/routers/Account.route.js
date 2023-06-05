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
  getUserByIdController,
  changePasswordController,
} from '../controllers/account.controller.js';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';

export const accountRouter = Router();

accountRouter.post('/auth/register', createAccountController);
accountRouter.post('/auth/login', loginAccountController);
accountRouter.post('/admin/auth/login', loginAccountByAdminController);
accountRouter.post('/accounts/upload_avatar', uploadAvatarController);
accountRouter.get('/accounts/info', authMiddleware(), getAccountByAccessTokenController);
accountRouter.get('/accounts/:id', authMiddleware(), getUserByIdController);
accountRouter.get('/accounts', authMiddlewareByAdmin(), getUsersController);
accountRouter.delete('/accounts/:id', authMiddlewareByAdmin(), deleteUserController);
accountRouter.patch('/accounts/:id', authMiddleware(), updateUserController);
accountRouter.post('/accounts/change_password', authMiddleware(), changePasswordController);
