import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const SeatTypeModel = DbService.sequelize.define(
  'seat_types',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
