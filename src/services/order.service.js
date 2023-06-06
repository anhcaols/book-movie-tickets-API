import { OrderModel } from '../models/order.model.js';
import { Op, Sequelize } from 'sequelize';

export class OrderService {
  async getOrderById(orderId) {
    return await OrderModel.findByPk(orderId);
  }

  async getAllOrdersByUser(offset, limit, userId, dateTime) {
    if (dateTime) {
      const dateStart = new Date(dateTime); // Tạo một đối tượng ngày từ dateTime
      const dateEnd = new Date(dateTime); // Tạo một đối tượng ngày từ dateTime
      dateEnd.setDate(dateEnd.getDate() + 1);

      if (userId === 'all') {
        return await OrderModel.findAll({
          offset,
          limit,
          order: [['id', 'DESC']],
          where: {
            order_date: {
              [Op.between]: [dateStart, dateEnd],
            },
          },
        });
      } else {
        return await OrderModel.findAll({
          offset,
          limit,
          order: [['id', 'DESC']],
          where: {
            user_id: userId,
            order_date: {
              [Op.between]: [dateStart, dateEnd],
            },
          },
        });
      }
    } else {
      if (userId === 'all') {
        return await OrderModel.findAll({ offset, limit, order: [['id', 'DESC']] });
      } else {
        return await OrderModel.findAll({
          offset,
          limit,
          order: [['id', 'DESC']],
          where: {
            user_id: userId,
          },
        });
      }
    }
  }

  async getReportRevenue(model) {
    let startDate, endDate;

    if (model >= 1 && model <= 12) {
      // Truy vấn theo tháng
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, model - 1, 1);
      endDate = new Date(currentYear, model, 0);
    } else if (model >= 1000 && model <= 9999) {
      // Truy vấn theo năm
      startDate = new Date(model, 0, 1);
      endDate = new Date(model, 11, 31);
    } else {
      throw new Error('Invalid model value. Model should be a month (1-12) or a year (1000-9999).');
    }

    return await OrderModel.findAll({
      where: {
        order_date: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
    });
  }

  async getOrderCountsByUser(userId, dateTime) {
    if (dateTime) {
      const dateStart = new Date(dateTime); // Tạo một đối tượng ngày từ dateTime
      const dateEnd = new Date(dateTime); // Tạo một đối tượng ngày từ dateTime
      dateEnd.setDate(dateEnd.getDate() + 1);

      if (userId === 'all') {
        return await OrderModel.count({
          where: {
            order_date: {
              [Op.between]: [dateStart, dateEnd],
            },
          },
        });
      } else {
        return await OrderModel.count({
          where: {
            user_id: userId,
            order_date: {
              [Op.between]: [dateStart, dateEnd],
            },
          },
        });
      }
    } else {
      if (userId === 'all') {
        return await OrderModel.count();
      } else {
        return await OrderModel.count({
          where: { user_id: userId },
        });
      }
    }
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
