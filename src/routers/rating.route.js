import 'express-async-errors';

import { Router } from 'express';
import { createRatingController, getRatingsController } from '../controllers/rating.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const ratingRouter = Router();

ratingRouter.get('/ratings', authMiddleware(), getRatingsController);
ratingRouter.post('/ratings', authMiddleware(), createRatingController);
