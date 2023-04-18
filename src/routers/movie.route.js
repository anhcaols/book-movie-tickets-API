import 'express-async-errors';
import { Router } from 'express';
import {
  createMovieController,
  deleteMovieController,
  getComingSoonMoviesController,
  getMovieController,
  getMoviesController,
  getNowShowingMoviesController,
  updateMovieController,
} from '../controllers/movie.controller.js';
import multer from 'multer';
import { authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';

export const movieRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/movies');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

movieRouter.get('/movies', getMoviesController);
movieRouter.get('/movies/now-showing', getNowShowingMoviesController);
movieRouter.get('/movies/coming-soon', getComingSoonMoviesController);
movieRouter.get('/movies/:slug', getMovieController);

movieRouter.post('/movies', authMiddlewareByAdmin, upload.single('image'), createMovieController);
movieRouter.delete('/movies/:id', authMiddlewareByAdmin, deleteMovieController);
movieRouter.patch('/movies/:id', authMiddlewareByAdmin, upload.single('image'), updateMovieController);
