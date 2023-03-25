import { DbService } from '../services/db-service.js';
import { DataTypes } from 'sequelize';
import { SeatModel } from './seat.model.js';
import { ScheduleModel } from './schedule.model.js';
import { OrderModel } from './order.model.js';

export const TicketModel = DbService.sequelize.define(
  'tickets',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

TicketModel.belongsTo(SeatModel, { foreignKey: 'seat_id' });
TicketModel.belongsTo(ScheduleModel, { foreignKey: 'schedule_id' });
TicketModel.belongsTo(OrderModel, { foreignKey: 'order_id' });
