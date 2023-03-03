import { DbService } from '../services/DbService.js';
import { DataTypes } from 'sequelize';

export const GenresModel = DbService.sequelize.define(
  'genres',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);
