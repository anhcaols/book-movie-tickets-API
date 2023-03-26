import { OrderModel } from '../models/order.model.js';

export class OrderService {
  async getOrderById(orderId) {
    return await OrderModel.findByPk(orderId);
  }

  async getAllOrdersByUser(userId) {
    return await OrderModel.findAll({
      user_id: userId,
    });
  }

  async createOrder(order) {
    return await OrderModel.create(order);
  }

  async deleteOrder(orderId) {
    const order = await OrderModel.findByPk(orderId);
    if (order) {
      await order.destroy();
    }
  }

  async updateOrder(totalAmount, orderId) {
    return await OrderModel.update(
      {
        total_amount: totalAmount,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
  }
}

export const ordersService = new OrderService();
