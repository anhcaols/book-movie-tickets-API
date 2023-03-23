import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createScheduleController,
  deleteScheduleController,
  getAllScheduleController,
} from '../controllers/schedule.controller.js';

export const scheduleRouter = Router();

scheduleRouter.post('/schedules', authMiddleware(), createScheduleController);
scheduleRouter.post('/all-schedules', getAllScheduleController);
scheduleRouter.delete('/schedules/:id', deleteScheduleController);
