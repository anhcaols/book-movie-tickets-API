import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { OrderModel } from './order.model.js';
import { FoodModel } from './food.model.js';

export const OrderDetailModel = DbService.sequelize.define(
  'order_details',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
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

OrderModel.hasMany(OrderDetailModel, { foreignKey: 'order_id' });
OrderDetailModel.belongsTo(OrderModel, { foreignKey: 'order_id' });

FoodModel.hasMany(OrderDetailModel, { foreignKey: 'food_id' });
OrderDetailModel.belongsTo(FoodModel, { foreignKey: 'food_id' });
