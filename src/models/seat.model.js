import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { RoomModel } from './room.model.js';
import { SeatTypeModel } from './seat-type.model.js';

export const SeatModel = DbService.sequelize.define(
  'seats',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    seat_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    timestamps: false,
  }
);

RoomModel.hasMany(SeatModel, { foreignKey: 'room_id' });
SeatModel.belongsTo(RoomModel, { foreignKey: 'room_id' });

// SeatModel.hasMany(SeatTypeModel, { foreignKey: 'seat_type_id' });
// SeatTypeModel.belongsTo(SeatModel, { foreignKey: 'seat_type_id' });
