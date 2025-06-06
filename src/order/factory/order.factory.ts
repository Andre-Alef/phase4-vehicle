import { Order } from "../model/order.model";

interface IOrder {
  id?: string;
  vehicleId: string;
  cpf: string;
  status: string;
  date: Date;
}

export class OrderFactory {
  create({ id, vehicleId, cpf, status, date }: IOrder): Order {
    return new Order({ id, vehicleId, cpf, status, date });
  }
}
