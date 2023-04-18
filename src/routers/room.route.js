import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
import { createRoomController, deleteRoomController, getRoomsController } from '../controllers/room.controller.js';

export const roomRouter = Router();

roomRouter.post('/rooms', authMiddlewareByAdmin(), createRoomController);
roomRouter.delete('/rooms/:id', authMiddlewareByAdmin(), deleteRoomController);
roomRouter.get('/rooms', authMiddleware(), getRoomsController);
