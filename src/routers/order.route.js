import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createOrderController, deleteOrderController } from '../controllers/order.controller.js';

export const orderRouter = Router();

orderRouter.post('/orders', authMiddleware(), createOrderController);
orderRouter.delete('/orders/:id', authMiddleware(), deleteOrderController);
