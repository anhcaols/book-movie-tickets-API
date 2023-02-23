import { GlobalConfig } from "../config/index.js";
import express from "express";
import bodyParser from "express";
import cors from "cors";

import { mainRouter } from "../routers/index.js";
import { ApiError } from "../api-error.js";

import httpStatus from "http-status";


export class WebService {
  protected;
  static app;
  static port = GlobalConfig.port || 3000;

  static async start() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(upload.array("file"));
    // this.app.use(express.static(path.join(__dirname, "./public")));
    this.app.use(cors());
    this.app.options("*", cors());


    this.app.use(mainRouter);
    this.app.use((err, req, res, next) => {
      // Theem bat loi tai day
      console.log(err);
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
      } else if (err?.isJoi && err.isJoi) {
        res.status(httpStatus.BAD_REQUEST).json({ message: err.message });

      } else {
        res.status(500).json({
          message: "Interval error"
        });

      }

    });
    this.app.listen(this.port, () => {
      console.log("Webservice start at port: 3000");
    });

  }
}