import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createSeatTypeController,
  deleteSeatTypeController,
  updateSeatTypeController,
} from '../controllers/seat-type.controller.js';

export const seatTypeRouter = Router();

seatTypeRouter.post('/seat-types', authMiddleware(), createSeatTypeController);
seatTypeRouter.delete('/seat-types/:id', authMiddleware(), deleteSeatTypeController);
seatTypeRouter.patch('/seat-types/:id', authMiddleware(), updateSeatTypeController);
