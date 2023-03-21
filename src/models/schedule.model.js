import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const ScheduleModel = DbService.sequelize.define(
  'schedules',
  {
    movie_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
