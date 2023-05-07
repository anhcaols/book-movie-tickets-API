import 'express-async-errors';

import { Router } from 'express';
import {
  createGenderController,
  deleteGenderController,
  getGendersController,
  updateGenderController,
} from '../controllers/genre.controller.js';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';

export const genreRouter = Router();

genreRouter.get('/genres', authMiddleware(), getGendersController);
genreRouter.post('/genres', authMiddleware(), createGenderController);
genreRouter.delete('/genres/:id', authMiddlewareByAdmin(), deleteGenderController);
genreRouter.patch('/genres/:id', authMiddlewareByAdmin(), updateGenderController);
