import { DbService } from '../services/DbService.js';
import { DataTypes } from 'sequelize';

export const CinemaModel = DbService.sequelize.define(
  'cinemas',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
