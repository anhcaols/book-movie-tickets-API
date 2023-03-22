import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const RoomModel = DbService.sequelize.define(
  'rooms',
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
    cinema_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    row_number: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    column_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
