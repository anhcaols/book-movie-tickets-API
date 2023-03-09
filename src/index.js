import { DbService } from './services/db-service.js';

import express from 'express';
import { WebService } from './services/web-service.js';

// respond with "hello world" when a GET request is made to the homepage

const app = express();
DbService.start().then(async () => {
  await WebService.start();
});
