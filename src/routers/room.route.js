import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createRoomController } from '../controllers/room.controller.js';

export const roomRouter = Router();

roomRouter.post('/rooms', authMiddleware(), createRoomController);
