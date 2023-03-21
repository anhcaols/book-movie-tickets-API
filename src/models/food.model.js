import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const TicketModel = DbService.sequelize.define(
  'food',
  {
    name: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
