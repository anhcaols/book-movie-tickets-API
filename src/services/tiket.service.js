import { TicketModel } from '../models/ticket.model.js';

export class TicketService {
  async getTicketById(ticketId) {
    return await TicketModel.findByPk(ticketId);
  }

  async createTicket(ticket) {
    return await TicketModel.bulkCreate(ticket);
  }

  async deleteTicket(orderId) {
    const tickets = await TicketModel.findAll({
      where: { order_id: orderId },
    });
    tickets.map(async (ticket) => {
      await ticket.destroy();
    });
  }
}

export const ticketsService = new TicketService();
