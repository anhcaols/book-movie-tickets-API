import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { RoomModel } from './room.model.js';

export const SeatModel = DbService.sequelize.define(
  'seats',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    row_position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    column_position: {
      type: DataTypes.INTEGER,
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

RoomModel.hasMany(SeatModel, { foreignKey: 'room_id' });
SeatModel.belongsTo(RoomModel, { foreignKey: 'room_id' });
