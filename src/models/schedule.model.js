import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const ScheduleModel = DbService.sequelize.define(
  'schedules',
  {
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
