import { DbService } from '../services/db-service.js';
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
