import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const CinemaModel = DbService.sequelize.define(
  'cinemas',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
