import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { ScheduleModel } from './schedule.model.js';
import { SeatModel } from './seat.model.js';

export const StatusSeatModel = DbService.sequelize.define(
  'status_seat',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

StatusSeatModel.belongsTo(ScheduleModel, { foreignKey: 'ScheduleID' });
ScheduleModel.hasMany(StatusSeatModel, { foreignKey: 'ScheduleID' });

StatusSeatModel.belongsTo(SeatModel, { foreignKey: 'SeatID' });
SeatModel.hasMany(StatusSeatModel, { foreignKey: 'SeatID' });
