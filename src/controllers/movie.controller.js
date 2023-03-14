import { MovieSchema } from '../dto/movie.js';
import { MovieService } from '../services/movie.service.js';
import { MovieGenreService } from '../services/movie-genre.service.js';
import fs from 'fs';
import slugify from 'slugify';

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
    const response = await MovieService.createMovie({ ...value, image: req.file.filename, slug });
    genres.map(async (genre) => {
      await MovieGenreService.createMovieGenre({ movie_id: response.dataValues.id, genre_id: Number(genre) });
    });

    res.json({ message: 'Create movie successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteMovieController = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await MovieService.getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        message: 'Movie does not found',
        status: 404,
      });
    }
    const imageName = movie.dataValues.image;
    if (imageName) {
      fs.unlink(`public/images/${imageName}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    await MovieService.deleteMovie(movieId);
    await MovieGenreService.deleteMovieGenre(movieId);

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
    const movie = await MovieService.getMovieById(movieId);
    if (!movie) {
      // neu khong co phim thi xoa anh di
      const imageName = req.file.filename;
      if (imageName) {
        fs.unlink(`public/images/${imageName}`, (err) => {
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
    // xoa anh cu khi cap nhat anh moi
    const imageName = movie.dataValues.image;
    fs.unlink(`public/images/${imageName}`, (err) => {
      if (err) {
        throw err;
      }
    });

    await MovieService.updateMovie({ ...value, image: req.file.filename, slug }, movieId);
    res.json({ message: 'Update genre successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getMoviesController = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const movies = await MovieService.getMovies(offset, limit);
  const totalDocs = await MovieService.getMoviesCount();
  const totalPages = Math.ceil(totalDocs / limit);

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = movies.map((movie) => {
    const genres = movie.genres.map((genre) => genre.name);

    return {
      id: movie.dataValues.id,
      name: movie.dataValues.name,
      description: movie.dataValues.description,
      releaseDate: movie.dataValues.release_date,
      duration: movie.dataValues.duration,
      actor: movie.dataValues.actor,
      director: movie.dataValues.director,
      language: movie.dataValues.language,
      country: movie.dataValues.country,
      producer: movie.dataValues.producer,
      status: movie.dataValues.status,
      age: movie.dataValues.producer.age,
      image: movie.dataValues.image,
      trailer: movie.dataValues.trailer,
      genres: [...genres],
      slug: movie.dataValues.slug,
    };
  });
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
  const limit = parseInt(req.query.limit) || 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const nowShowingMovies = await MovieService.getMovies(offset, limit, 'nowShowing');
  const totalDocs = await MovieService.getMoviesCount('nowShowing');
  const totalPages = Math.ceil(totalDocs / limit);

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = nowShowingMovies.map((movie) => {
    const genres = movie.genres.map((genre) => genre.name);

    return {
      id: movie.dataValues.id,
      name: movie.dataValues.name,
      description: movie.dataValues.description,
      releaseDate: movie.dataValues.release_date,
      duration: movie.dataValues.duration,
      actor: movie.dataValues.actor,
      director: movie.dataValues.director,
      language: movie.dataValues.language,
      country: movie.dataValues.country,
      producer: movie.dataValues.producer,
      status: movie.dataValues.status,
      age: movie.dataValues.producer.age,
      image: movie.dataValues.image,
      trailer: movie.dataValues.trailer,
      genres: [...genres],
      slug: movie.dataValues.slug,
    };
  });
  try {
    res.json({
      message: 'Get now showing movies successfully',
      movies: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
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
  const limit = parseInt(req.query.limit) || 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const comingSoonMovies = await MovieService.getMovies(offset, limit, 'comingSoon');
  const totalDocs = await MovieService.getMoviesCount('comingSoon');
  const totalPages = Math.ceil(totalDocs / limit);

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const data = comingSoonMovies.map((movie) => {
    const genres = movie.genres.map((genre) => genre.name);

    return {
      id: movie.dataValues.id,
      name: movie.dataValues.name,
      description: movie.dataValues.description,
      releaseDate: movie.dataValues.release_date,
      duration: movie.dataValues.duration,
      actor: movie.dataValues.actor,
      director: movie.dataValues.director,
      language: movie.dataValues.language,
      country: movie.dataValues.country,
      producer: movie.dataValues.producer,
      status: movie.dataValues.status,
      age: movie.dataValues.producer.age,
      image: movie.dataValues.image,
      trailer: movie.dataValues.trailer,
      genres: [...genres],
      slug: movie.dataValues.slug,
    };
  });
  try {
    res.json({
      message: 'Get coming soon movies successfully',
      movies: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
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

  const movie = await MovieService.getMovieBySlug(slug);
  if (!movie) {
    return res.status(404).json({
      message: 'Movie does not found',
      status: 404,
    });
  }

  const data = movie.map((movie) => {
    const genres = movie.genres.map((genre) => genre.name);

    return {
      id: movie.dataValues.id,
      name: movie.dataValues.name,
      description: movie.dataValues.description,
      releaseDate: movie.dataValues.release_date,
      duration: movie.dataValues.duration,
      actor: movie.dataValues.actor,
      director: movie.dataValues.director,
      language: movie.dataValues.language,
      country: movie.dataValues.country,
      producer: movie.dataValues.producer,
      status: movie.dataValues.status,
      age: movie.dataValues.producer.age,
      image: movie.dataValues.image,
      trailer: movie.dataValues.trailer,
      genres: [...genres],
      slug: movie.dataValues.slug,
    };
  });
  try {
    res.json({
      message: 'Get coming soon movies successfully',
      movies: data[0],
    });

    //   message: 'Get movie successfully',
    //   movie: {
    //     id: movie.dataValues.id,
    //     name: movie.dataValues.name,
    //     description: movie.dataValues.description,
    //     releaseDate: movie.dataValues.release_date,
    //     duration: movie.dataValues.duration,
    //     actor: movie.dataValues.actor,
    //     director: movie.dataValues.director,
    //     language: movie.dataValues.language,
    //     country: movie.dataValues.country,
    //     producer: movie.dataValues.producer,
    //     status: movie.dataValues.status,
    //     age: movie.dataValues.producer.age,
    //     image: movie.dataValues.image,
    //     trailer: movie.dataValues.trailer,
    //     slug: movie.dataValues.slug,
    //   },
    //   success: true,
    // });
  } catch (e) {
    next(e);
  }
};
