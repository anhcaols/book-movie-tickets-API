import 'express-async-errors';

import { Router } from 'express';
import { createAccountController, loginAccountController, test } from '../controllers/account.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { Role } from '../enums/auth.enum.js';

export const accountRouter = Router();

accountRouter.post('/auth/register', createAccountController);
accountRouter.post('/auth/login', loginAccountController);
accountRouter.get('/test', authMiddleware(), test);
