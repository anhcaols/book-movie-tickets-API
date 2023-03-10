import { GlobalConfig } from '../config/index.js';
import express from 'express';
import bodyParser from 'express';
import cors from 'cors';
import { mainRouter } from '../routers/index.js';
import { ApiError } from '../api-error.js';
import path from 'path';
import httpStatus from 'http-status';
import session from 'express-session';
import { fileURLToPath } from 'url';

export class WebService {
  protected;
  static app;
  static port = GlobalConfig.port || 8080;
  static async start() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/static', express.static(path.join(__dirname, '../../public/images')));
    this.app.use(cors());
    this.app.options('*', cors());

    this.app.use(
      session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
      })
    );

    this.app.use(mainRouter);
    this.app.use((err, req, res, next) => {
      // Them bat loi tai day
      console.log(err);
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
      } else if (err?.isJoi && err.isJoi) {
        res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
      } else {
        res.status(500).json({
          message: 'Interval error',
          status: 500,
        });
      }
    });
    this.app.listen(this.port, () => {
      console.log('WebService start at port: 8080');
    });
  }
}
