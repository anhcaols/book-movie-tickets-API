import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export class DbService {
  static sequelize = new Sequelize('book_movie_ticket', 'root', `${process.env.PASSWORD}`, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
  });

  static async start() {
    DbService.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });

    await DbService.sequelize.sync({});
  }
}
