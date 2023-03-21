import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const TicketModel = DbService.sequelize.define(
  'tickets',
  {
    seat_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    schedule_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
