import { DbService } from "../services/DbService.js";
import { DataTypes } from "sequelize";

export const AccountModel = DbService.sequelize.define("account", {

  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true

  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roles: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

