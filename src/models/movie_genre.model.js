import { DbService } from '../services/DbService.js';
import { DataTypes } from 'sequelize';

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
