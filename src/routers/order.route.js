import 'express-async-errors';

import { Router } from 'express';
import { authMiddleware, authMiddlewareByAdmin } from '../middlewares/auth.middleware.js';
import {
  createOrderController,
  deleteOrderController,
  getReportRevenue,
  getRevenueByMonth,
  getTicketByMonth,
  getUserOrdersController,
} from '../controllers/order.controller.js';

export const orderRouter = Router();

orderRouter.post('/orders', authMiddleware(), createOrderController);
orderRouter.delete('/orders/:id', authMiddleware(), deleteOrderController);
orderRouter.get('/user-orders/:id', authMiddleware(), getUserOrdersController);
orderRouter.get('/orders/report-revenue', authMiddlewareByAdmin(), getReportRevenue);
orderRouter.get('/orders/ticket', authMiddlewareByAdmin(), getTicketByMonth);
orderRouter.get('/orders/revenue-month/:year', authMiddlewareByAdmin(), getRevenueByMonth);
