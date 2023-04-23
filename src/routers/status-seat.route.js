import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
import {
  createStatusSeatController,
  getAllStatusSeatController,
  updateStatusSeatController,
} from '../controllers/status-seat.controller.js';

export const statusSeatRouter = Router();

statusSeatRouter.post('/status-seats', authMiddlewareByAdmin(), createStatusSeatController);
statusSeatRouter.patch('/status-seats', authMiddlewareByAdmin(), updateStatusSeatController);
statusSeatRouter.post('/status-seats/schedule/:id', authMiddleware(), getAllStatusSeatController);
