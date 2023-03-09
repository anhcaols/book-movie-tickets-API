import 'express-async-errors';

import { Router } from 'express';
import { createRatingController } from '../controllers/rating.controller.js';
import { verifyTokenMiddleware } from '../middlewares/verify-token.middleware.js';

export const ratingRouter = Router();

ratingRouter.post('/ratings', verifyTokenMiddleware(), createRatingController);
