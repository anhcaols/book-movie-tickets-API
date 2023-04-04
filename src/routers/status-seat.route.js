import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createStatusSeatController,
  getAllStatusSeatController,
  updateStatusSeatController,
} from '../controllers/status-seat.controller.js';

export const statusSeatRouter = Router();

statusSeatRouter.post('/status-seats', authMiddleware(), createStatusSeatController);
statusSeatRouter.patch('/status-seats', authMiddleware(), updateStatusSeatController);
statusSeatRouter.post('/status-seats/schedule', getAllStatusSeatController);
