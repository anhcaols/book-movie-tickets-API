import 'express-async-errors';

import { Router } from 'express';
import {
  createCinemaController,
  deleteCinemaController,
  getCinemasController,
  updateCinemaController,
} from '../controllers/cinema.controller.js';

export const cinemaRouter = Router();

cinemaRouter.post('/cinemas', createCinemaController);
cinemaRouter.delete('/cinemas/:id', deleteCinemaController);
cinemaRouter.patch('/cinemas/:id', updateCinemaController);
cinemaRouter.get('/cinemas', getCinemasController);
