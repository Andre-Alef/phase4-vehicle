import { Order } from "../model/order.model";

interface IOrder {
  id?: string;
  vehicleId: string;
  userId: string;
  status: string;
}

export class OrderFactory {
  create({ id, vehicleId, userId, status }: IOrder): Order {
    return new Order({ id, vehicleId, userId, status });
  }
}
