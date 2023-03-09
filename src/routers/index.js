import express from 'express';
import { accountRouter } from './account.route.js';
import { cinemaRouter } from './cinema.route.js';
import { genreRouter } from './genre.route.js';
import { movieRouter } from './movie.route.js';
export const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cao Anh API' });
});

mainRouter.use('/api', accountRouter);
mainRouter.use('/api', genreRouter);
mainRouter.use('/api', movieRouter);
mainRouter.use('/api', cinemaRouter);
