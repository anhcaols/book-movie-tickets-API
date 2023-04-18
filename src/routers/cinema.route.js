import 'express-async-errors';

import { Router } from 'express';
import {
  createCinemaController,
  deleteCinemaController,
  getCinemasController,
  updateCinemaController,
} from '../controllers/cinema.controller.js';
import { authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';

export const cinemaRouter = Router();

cinemaRouter.post('/cinemas', authMiddlewareByAdmin(), createCinemaController);
cinemaRouter.delete('/cinemas/:id', authMiddlewareByAdmin(), deleteCinemaController);
cinemaRouter.patch('/cinemas/:id', authMiddlewareByAdmin(), updateCinemaController);
cinemaRouter.get('/cinemas', authMiddlewareByAdmin(), getCinemasController);
