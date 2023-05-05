import { MovieSchema } from '../dto/movie.js';
import { moviesService } from '../services/movie.service.js';
import { movieGenreServiceService } from '../services/movie-genre.service.js';
import fs from 'fs';
import slugify from 'slugify';
import { ratingsService } from '../services/rating.service.js';
import { utils } from '../utils/index.js';

export const createMovieController = async (req, res, next) => {
  try {
    const { error, value } = MovieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const slug = slugify(value.name, {
      replacement: '-',
      remove: ':',
      lower: true,
      strict: false,
      locale: 'vi',
      trim: true,
    });
    const genres = value.genre_id.split(',');
    const response = await moviesService.createMovie({ ...value, image: req.file.filename, slug });
    genres.map(async (genre) => {
      await movieGenreServiceService.createMovieGenre({ movie_id: response.dataValues.id, genre_id: Number(genre) });
    });

    res.json({ message: 'Create movie successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await moviesService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }
    const imageName = movie.dataValues.image;
    if (imageName) {
      fs.unlink(`public/images/movies/${imageName}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    await moviesService.deleteMovie(movieId);
    await movieGenreServiceService.deleteMovieGenre(movieId);

    res.json({ message: 'Delete movie successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const updateMovieController = async (req, res, next) => {
  try {
    const { error, value } = MovieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }

    const slug = slugify(value.name, {
      replacement: '-',
      remove: ':',
      lower: true,
      strict: false,
      locale: 'vi',
      trim: true,
    });

    const movieId = req.params.id;
    const movie = await moviesService.getMovieById(movieId);
    // if movie not found then delete image
    if (!movie) {
      const imageName = req.file.filename;
      if (imageName) {
        fs.unlink(`public/images/movies/${imageName}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }
    // Delete image old and insert new image
    const imageName = movie.dataValues.image;
    fs.unlink(`public/images/movies/${imageName}`, (err) => {
      if (err) {
        throw err;
      }
    });

    await moviesService.updateMovie({ ...value, image: req.file.filename, slug }, movieId);
    res.json({ message: 'Update genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getMoviesController = async (req, res, next) => {
  const totalDocs = await moviesService.getMoviesCount();
  const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
  const movies = await moviesService.getMovies(offset, limit);

  const data = await Promise.all(
    movies.map(async (movie) => {
      const genres = movie.genres.map((genre) => genre.name);
      const movieId = movie.dataValues.id;
      const scoreRate = await handleGetScoreRate(movieId);
      const newMovie = handleNewMovie(movie);
      return {
        ...newMovie,
        genres: [...genres],
        scoreRate,
      };
    })
  );
  try {
    res.json({
      message: 'Get movies successfully',
      movies: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page: Number(page),
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getNowShowingMoviesController = async (req, res, next) => {
  const totalDocs = await moviesService.getMoviesCount({ status: 1 });
  const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
  const nowShowingMovies = await moviesService.getMovies(offset, limit, { status: 1 });

  const data = await Promise.all(
    nowShowingMovies.map(async (movie) => {
      const genres = movie.genres.map((genre) => genre.name);
      const movieId = movie.dataValues.id;
      const scoreRate = await handleGetScoreRate(movieId);
      const newMovie = handleNewMovie(movie);
      return {
        ...newMovie,
        genres: [...genres],
        scoreRate,
      };
    })
  );
  try {
    res.json({
      message: 'Get now showing movies successfully',
      movies: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page: Number(page),
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getComingSoonMoviesController = async (req, res, next) => {
  const totalDocs = await moviesService.getMoviesCount({ status: 0 });
  const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);
  const comingSoonMovies = await moviesService.getMovies(offset, limit, { status: 0 });

  const data = await Promise.all(
    comingSoonMovies.map(async (movie) => {
      const genres = movie.genres.map((genre) => genre.name);
      const movieId = movie.dataValues.id;
      const scoreRate = await handleGetScoreRate(movieId);
      const newMovie = handleNewMovie(movie);

      return {
        ...newMovie,
        genres: [...genres],
        scoreRate,
      };
    })
  );
  try {
    res.json({
      message: 'Get coming soon movies successfully',
      movies: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page: Number(page),
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getMovieController = async (req, res, next) => {
  const slug = req.params.slug;

  const movie = await moviesService.getMovieBySlug(slug);
  if (!movie) {
    return res.status(404).json({
      message: 'Movie does not found',
      status: 404,
    });
  }

  const data = await Promise.all(
    movie.map(async (movie) => {
      const genres = movie.genres.map((genre) => genre.name);
      const movieId = movie.dataValues.id;
      const scoreRate = await handleGetScoreRate(movieId);
      const newMovie = handleNewMovie(movie);
      return {
        ...newMovie,
        genres: [...genres],
        scoreRate,
      };
    })
  );

  try {
    res.json({
      message: 'Get coming soon movies successfully',
      movie: data[0],
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const handleGetScoreRate = async (movieId) => {
  let sumRate = 0;
  const rates = await ratingsService.getRatesByMovie(movieId);
  rates.map((rate) => {
    sumRate += rate.dataValues.rate;
  });
  const scoreRate = sumRate / rates.length;
  return scoreRate;
};

export const handleNewMovie = (movie) => {
  let newMovie = {};
  for (let key in movie.dataValues) {
    if (key === 'release_date') {
      newMovie.releaseDate = movie[key];
    } else {
      newMovie[key] = movie[key];
    }
  }
  return newMovie;
};
