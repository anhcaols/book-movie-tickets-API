import { DbService } from '../services/DbService.js';
import { DataTypes } from 'sequelize';

export const AccountModel = DbService.sequelize.define(
  'accounts',
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
  {
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
      {
        fields: ['phone_number'],
        unique: true,
      },
    ],
  }
);
