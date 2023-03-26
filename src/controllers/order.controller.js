import { OrderSchema } from '../dto/order.js';
import { ordersService } from '../services/order.service.js';
import { schedulesService } from '../services/schedule.service.js';
import { seatTypesService } from '../services/seat-type.service.js';
import { seatsService } from '../services/seat.service.js';
import { statusSeatsService } from '../services/status-seat.service.js';
import { ticketsService } from '../services/tiket.service.js';
import moment from 'moment-timezone';
import { foodsService } from '../services/food.service.js';
import { orderDetailsService } from '../services/order-detail.service.js';
import { accountsService } from '../services/account.service.js';

export const createOrderController = async (req, res, next) => {
  try {
    const { error, value } = OrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
    const userId = value.user_id;
    const seatIds = value.seat_id;
    const scheduleId = value.schedule_id;
    const foods = value.food;

    const schedule = await schedulesService.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        message: 'Schedule not found',
        status: 404,
      });
    }

    const dateNow = moment().tz('Asia/Ho_Chi_Minh').format();
    const order = await ordersService.createOrder({
      user_id: userId,
      order_date: dateNow,
      total_amount: 0,
    });

    // Create ticket & total cost of tickets
    let totalTicketPrice = 0;
    let tickets = [];
    for (const seatId of seatIds) {
      const seat = await seatsService.getSeat(seatId);
      const seatTypeId = seat.dataValues.seat_type_id;
      const seatType = await seatTypesService.getSeatType(seatTypeId);
      const ticketPrice = parseFloat(seatType.dataValues.price);
      totalTicketPrice += ticketPrice;
      tickets.push({
        seat_id: seatId,
        schedule_id: scheduleId,
        order_id: order.dataValues.id,
      });
    }
    await ticketsService.createTicket(tickets);

    // Create order detail & total cost of food
    let totalFoodPrice = 0;
    let orderDetails = [];
    for (const foodItem of foods) {
      const food = await foodsService.getFoodById(foodItem.id);
      orderDetails.push({
        food_id: foodItem.id,
        order_id: order.dataValues.id,
        quantity: foodItem.quantity,
        price: food.dataValues.price,
      });

      const foodPrice = parseFloat(food.dataValues.price);
      totalFoodPrice += foodPrice * foodItem.quantity;
    }
    await orderDetailsService.createOrderDetail(orderDetails);

    // Update total order amount
    const totalAmount = totalFoodPrice + totalTicketPrice;
    await ordersService.updateOrder(totalAmount, order.dataValues.id);

    const newOrder = await ordersService.getOrderById(order.dataValues.id);
    const user = await accountsService.getAccountById(userId);

    const data = {
      id: newOrder.dataValues.id,
      user: {
        id: user.dataValues.id,
        fullName: user.dataValues.full_name,
        email: user.dataValues.email,
        phoneNumber: user.dataValues.phone_number,
        role: user.dataValues.role,
      },
      orderDate: moment(newOrder.dataValues.order_date).format(),
      totalAmount: newOrder.dataValues.total_amount,
    };

    res.json({ message: 'Create order successfully', order: data, success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteOrderController = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await ordersService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        message: 'Order does not found',
        status: 404,
      });
    }

    await orderDetailsService.deleteOrderDetail(orderId);
    await ticketsService.deleteTicket(orderId);
    await ordersService.deleteOrder(orderId);

    res.json({ message: 'Delete order successfully', success: true });
  } catch (e) {
    next(e);
  }
};
