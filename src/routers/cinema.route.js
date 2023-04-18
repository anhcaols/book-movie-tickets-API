import 'express-async-errors';

import { Router } from 'express';
import {
  createCinemaController,
  deleteCinemaController,
  getCinemaController,
  getCinemasController,
  updateCinemaController,
} from '../controllers/cinema.controller.js';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';

export const cinemaRouter = Router();

cinemaRouter.post('/cinemas', authMiddlewareByAdmin(), createCinemaController);
cinemaRouter.delete('/cinemas/:id', authMiddlewareByAdmin(), deleteCinemaController);
cinemaRouter.patch('/cinemas/:id', authMiddlewareByAdmin(), updateCinemaController);
cinemaRouter.get('/cinemas', authMiddleware(), getCinemasController);
cinemaRouter.get('/cinemas/:id', authMiddleware(), getCinemaController);
