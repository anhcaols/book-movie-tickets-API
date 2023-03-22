import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const ScheduleModel = DbService.sequelize.define(
  'schedules',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
