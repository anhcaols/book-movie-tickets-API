import 'express-async-errors';

import { Router } from 'express';
import {
  createRatingController,
  getRatingsController,
  getScoreRateController,
} from '../controllers/rating.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const ratingRouter = Router();

ratingRouter.get('/ratings/:id', getRatingsController);
ratingRouter.get('/ratings/score/:id', getScoreRateController);
ratingRouter.post('/ratings', authMiddleware(), createRatingController);
