import 'express-async-errors';

import { Router } from 'express';
import { authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
import {
  createSeatTypeController,
  deleteSeatTypeController,
  updateSeatTypeController,
} from '../controllers/seat-type.controller.js';

export const seatTypeRouter = Router();

seatTypeRouter.post('/seat-types', authMiddlewareByAdmin(), createSeatTypeController);
seatTypeRouter.delete('/seat-types/:id', authMiddlewareByAdmin(), deleteSeatTypeController);
seatTypeRouter.patch('/seat-types/:id', authMiddlewareByAdmin(), updateSeatTypeController);
