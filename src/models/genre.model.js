import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const GenresModel = DbService.sequelize.define(
  'genres',
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
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);
