import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const SeatModel = DbService.sequelize.define(
  'status_seat',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    row_position: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    column_position: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.NUMBER,
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
