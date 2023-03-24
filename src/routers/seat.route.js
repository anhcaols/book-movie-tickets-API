import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createSeatController } from '../controllers/seat.controller.js';

export const seatRouter = Router();

seatRouter.post('/seats', authMiddleware(), createSeatController);
