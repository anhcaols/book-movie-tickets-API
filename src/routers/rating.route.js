import 'express-async-errors';

import { Router } from 'express';
import { createRatingController } from '../controllers/rating.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const ratingRouter = Router();

ratingRouter.post('/ratings', authMiddleware(), createRatingController);
