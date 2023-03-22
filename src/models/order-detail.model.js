import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const TicketModel = DbService.sequelize.define(
  'order_detail',
  {
    food_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
