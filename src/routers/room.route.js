import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createRoomController, deleteRoomController } from '../controllers/room.controller.js';

export const roomRouter = Router();

roomRouter.post('/rooms', authMiddleware(), createRoomController);
roomRouter.delete('/rooms/:id', authMiddleware(), deleteRoomController);
