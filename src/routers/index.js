import express from 'express';
import { accountRouter } from './Account.route.js';

export const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to Cao Anh API' });
});

mainRouter.use('/api', accountRouter);
