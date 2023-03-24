import express from 'express';
import { accountRouter } from './account.route.js';
import { cinemaRouter } from './cinema.route.js';
import { genreRouter } from './genre.route.js';
import { movieRouter } from './movie.route.js';
import { ratingRouter } from './rating.route.js';
import { roomRouter } from './room.route.js';
import { scheduleRouter } from './schedule.route.js';
import { seatRouter } from './seat.route.js';
import { statusSeatRouter } from './status-seat.route.js';

export const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cao Anh API' });
});

mainRouter.use('/api', accountRouter);
mainRouter.use('/api', genreRouter);
mainRouter.use('/api', movieRouter);
mainRouter.use('/api', cinemaRouter);
mainRouter.use('/api', ratingRouter);
mainRouter.use('/api', roomRouter);
mainRouter.use('/api', scheduleRouter);
mainRouter.use('/api', statusSeatRouter);
mainRouter.use('/api', seatRouter);
