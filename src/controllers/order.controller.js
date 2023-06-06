import { OrderSchema, ReportRevenue } from '../dto/order.js';
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
import { moviesService } from '../services/movie.service.js';
import { roomsService } from '../services/room.service.js';
import { cinemasService } from '../services/cinema.service.js';
import { utils } from '../utils/index.js';

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
    const seatIds = value.seats;
    const scheduleId = value.schedule_id;
    const foods = value.foods;

    for (const seatId of seatIds) {
      const statusSeat = await statusSeatsService.getStatusSeat(seatId, scheduleId);
      if (statusSeat.dataValues.status === 'booked') {
        return res.status(404).json({
          message: 'Schedules available with seats',
          status: 404,
        });
      }
    }

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
      status: 0,
    });

    // Create ticket & total cost of tickets & update status seat
    let totalTicketPrice = 0;
    let tickets = [];
    for (const seatId of seatIds) {
      const seat = await seatsService.getSeatById(seatId);
      const seatTypeId = seat.dataValues.seat_type_id;
      const seatType = await seatTypesService.getSeatType(seatTypeId);
      const ticketPrice = parseFloat(seatType.dataValues.price);
      totalTicketPrice += ticketPrice;
      tickets.push({
        seat_id: seatId,
        schedule_id: scheduleId,
        order_id: order.dataValues.id,
      });

      await statusSeatsService.updateStatusSeat(seatId, scheduleId, 'booked');
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

    const tickets = await ticketsService.getAllTicketsByOrderId(orderId);
    tickets.map(async (ticket) => {
      await statusSeatsService.updateStatusSeat(ticket.dataValues.seat_id, ticket.dataValues.schedule_id, 'available');
    });

    await orderDetailsService.deleteOrderDetail(orderId);
    await ticketsService.deleteTicket(orderId);
    await ordersService.deleteOrder(orderId);

    res.json({ message: 'Delete order successfully', success: true });
  } catch (e) {
    next(e);
  }
};

export const getUserOrdersController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { dateTime } = req.query;
    if (userId !== 'all') {
      const account = await accountsService.getAccountById(userId);
      if (!account) {
        return res.status(404).json({
          message: 'Account does not found',
          status: 404,
        });
      }
    }

    const totalDocs = await ordersService.getOrderCountsByUser(userId, dateTime && dateTime);
    const { offset, limit, page, totalPages, hasNextPage, hasPrevPage } = await utils.pagination(req, totalDocs);

    const orders = await ordersService.getAllOrdersByUser(offset, limit, userId, dateTime && dateTime);
    const data = await Promise.all(
      orders.map(async (order) => {
        const account = await accountsService.getAccountById(order.dataValues.user_id);
        let seats = [];
        let movieName = '';
        let cinemaName = '';
        let startTime = '';
        let roomName = '';
        const tickets = await ticketsService.getAllTicketsByOrderId(order.dataValues.id);

        // Get movie, cinema, startTime form schedule
        if (tickets.length > 0) {
          const schedule = await schedulesService.getScheduleById(tickets[0].dataValues.schedule_id);
          const movie = await moviesService.getMovieById(schedule.dataValues.movie_id);
          movieName = movie.dataValues.name;
          const room = await roomsService.getRoomById(schedule.dataValues.room_id);
          roomName = room.dataValues.name;
          const cinema = await cinemasService.getCinemaById(room.dataValues.cinema_id);
          cinemaName = cinema.dataValues.name;
          startTime = moment(schedule.dataValues.start_time).format();
        }
        // Get seats
        for (const ticket of tickets) {
          const seat = await seatsService.getSeatById(ticket.dataValues.seat_id);
          seats.push({
            id: seat.dataValues.id,
            rowPosition: seat.dataValues.row_position,
            columnPosition: seat.dataValues.column_position,
          });
        }

        //Get foods
        let foods = [];
        const orderDetails = await orderDetailsService.getOrderDetailByOrderId(order.dataValues.id);
        for (const orderDetail of orderDetails) {
          const food = await foodsService.getFoodById(orderDetail.dataValues.food_id);
          foods.push({ id: food.dataValues.id, name: food.dataValues.name });
        }

        return {
          id: order.dataValues.id,
          user: {
            id: account.dataValues.id,
            fullName: account.dataValues.full_name,
            email: account.dataValues.email,
            phoneNumber: account.dataValues.phone_number,
            role: account.dataValues.role,
          },
          seats,
          schedule: {
            movieName,
            cinemaName,
            startTime,
            roomName,
          },
          foods,
          totalAmount: Number(order.dataValues.total_amount),
          orderDate: order.dataValues.order_date,
          status: order.dataValues.status,
        };
      })
    );

    res.json({
      message: 'Get all the order of each user',
      orders: data,
      paginationOptions: {
        totalDocs,
        offset,
        limit,
        totalPages,
        page,
        hasNextPage,
        hasPrevPage,
      },
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getReportRevenue = async (req, res, next) => {
  try {
    const { model } = req.query;
    const reportRevenue = await ordersService.getReportRevenue(model);
    let revenue = 0;
    reportRevenue.map((item) => {
      const totalAmount = parseFloat(item.dataValues.total_amount);
      revenue += totalAmount;
    });
    res.json({ message: 'Get report revenue successfully', data: revenue, success: true });
  } catch (e) {
    next(e);
  }
};

export const getTicketByMonth = async (req, res, next) => {
  try {
    const { model } = req.query;
    const reportRevenue = await ordersService.getReportRevenue(model);
    const data = await Promise.all(
      reportRevenue.map(async (item) => {
        const tickets = await ticketsService.getAllTicketsByOrderId(item.dataValues.id);
        return tickets.map((ticket) => ticket.dataValues);
      })
    );

    res.json({ message: 'Get ticket by month successfully', data: data.length, success: true });
  } catch (e) {
    next(e);
  }
};

export const getRevenueByMonth = async (req, res, next) => {
  try {
    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const revenueByMonth = await ordersService.getRevenueByMonth();
    console.log(revenueByMonth);
    const formattedData = labels.map((month) => {
      const revenueItem = revenueByMonth.find((item) => item.month === month);
      console.log(revenueItem);
      const total = revenueItem ? parseFloat(revenueItem.total) : 0;
      return {
        month,
        total,
      };
    });
    res.json({ message: 'Get revenue by month successfully', data: formattedData, success: true });
  } catch (e) {
    next(e);
  }
};
