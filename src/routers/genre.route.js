import 'express-async-errors';

import { Router } from 'express';
import {
  createGenderController,
  deleteGenderController,
  updateGenderController,
} from '../controllers/genre.controller.js';

export const genreRouter = Router();

genreRouter.post('/genres', createGenderController);
genreRouter.delete('/genres/:id', deleteGenderController);
genreRouter.patch('/genres/:id', updateGenderController);
