import { Sequelize } from "sequelize";
import mysql from "mysql2";

export class DbService {

  static sequelize = new Sequelize("test", "root", "mysecret", {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
  });

  static async start() {
    DbService.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

    await DbService.sequelize.sync({});


  }


}