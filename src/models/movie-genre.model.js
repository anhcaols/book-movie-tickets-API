import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { MovieModel } from './movie.model.js';
import { GenresModel } from './genre.model.js';

export const MovieGenreModel = DbService.sequelize.define(
  'movie_genres',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.INTEGER,
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
