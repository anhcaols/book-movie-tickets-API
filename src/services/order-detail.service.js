import { OrderDetailModel } from '../models/order-detail.model.js';

export class OrderDetailService {
  async getOrderDetailById(orderDetailId) {
    return await OrderDetailModel.findByPk(orderDetailId);
  }

  async createOrderDetail(orderDetail) {
    return await OrderDetailModel.bulkCreate(orderDetail);
  }

  async deleteOrderDetail(orderId) {
    const orderDetails = await OrderDetailModel.findAll({
      where: { order_id: orderId },
    });
    orderDetails.map(async (orderDetail) => {
      await orderDetail.destroy();
    });
  }
}

export const orderDetailsService = new OrderDetailService();
