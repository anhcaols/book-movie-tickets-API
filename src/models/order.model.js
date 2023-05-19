import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const OrderModel = DbService.sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
