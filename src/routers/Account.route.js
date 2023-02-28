import 'express-async-errors';

import { Router } from 'express';
import { createAccount, loginAccount, logoutAccount, uploadAvatar, test } from '../controllers/account.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import multer from 'multer';

export const accountRouter = Router();

accountRouter.post('/auth/register', createAccount);
accountRouter.post('/auth/login', loginAccount);
accountRouter.post('/auth/logout', logoutAccount);
accountRouter.post('/accounts/upload_avatar', uploadAvatar);
accountRouter.get('/test', authMiddleware(), test);
