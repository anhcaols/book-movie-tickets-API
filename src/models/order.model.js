import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const OrderModel = DbService.sequelize.define(
  'orders',
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    movie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticket_number: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    seat: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    cinema: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    food: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);