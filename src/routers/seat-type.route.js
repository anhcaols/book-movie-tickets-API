import 'express-async-errors';

import { Router } from 'express';
import { authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
import {
  createSeatTypeController,
  deleteSeatTypeController,
  getSeatTypeController,
  getSeatTypesController,
  updateSeatTypeController,
} from '../controllers/seat-type.controller.js';

export const seatTypeRouter = Router();

seatTypeRouter.post('/seat-types', authMiddlewareByAdmin(), createSeatTypeController);
seatTypeRouter.delete('/seat-types/:id', authMiddlewareByAdmin(), deleteSeatTypeController);
seatTypeRouter.patch('/seat-types/:id', authMiddlewareByAdmin(), updateSeatTypeController);
seatTypeRouter.get('/seat-types/:id', authMiddlewareByAdmin(), getSeatTypeController);
seatTypeRouter.get('/seat-types', authMiddlewareByAdmin(), getSeatTypesController);
