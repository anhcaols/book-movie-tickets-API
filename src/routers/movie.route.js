import 'express-async-errors';
import { Router } from 'express';
import {
  createMovieController,
  deleteMovieController,
  getMoviesController,
  updateMovieController,
} from '../controllers/movie.controller.js';
import multer from 'multer';

export const movieRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

movieRouter.get('/movies', getMoviesController);
movieRouter.post('/movies', upload.single('image'), createMovieController);
movieRouter.delete('/movies/:id', deleteMovieController);
movieRouter.patch('/movies/:id', upload.single('image'), updateMovieController);
