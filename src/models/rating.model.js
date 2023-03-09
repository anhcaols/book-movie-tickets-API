import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';

export const RatingModel = DbService.sequelize.define(
  'ratings',
  {
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    movie_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
