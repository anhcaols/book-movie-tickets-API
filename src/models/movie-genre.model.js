import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { MovieModel } from './movie.model.js';
import { GenresModel } from './genre.model.js';

export const MovieGenreModel = DbService.sequelize.define(
  'movie_genres',
  {
    movie_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

MovieModel.belongsToMany(GenresModel, {
  through: MovieGenreModel,
  foreignKey: 'movie_id',
});

GenresModel.belongsToMany(MovieModel, {
  through: MovieGenreModel,
  foreignKey: 'genre_id',
});
