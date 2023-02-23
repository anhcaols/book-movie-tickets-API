import { DbService } from "./services/DbService.js";


import express from "express";
import { WebService } from "./services/WebService.js";

// respond with "hello world" when a GET request is made to the homepage

const app = express();
DbService.start().then(async () => {
  await WebService.start();
});
