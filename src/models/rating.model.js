import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { AccountModel } from './account.model.js';

export const RatingModel = DbService.sequelize.define('ratings', {
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
  movie_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false,
  },
});

AccountModel.hasMany(RatingModel, { foreignKey: 'user_id' });
RatingModel.belongsTo(AccountModel, { foreignKey: 'user_id' });
