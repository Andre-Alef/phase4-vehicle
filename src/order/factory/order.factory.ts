import { Order } from "../model/order.model";

interface IOrder {
  id?: string;
  vehicleId: string;
  cpf: string;
  status: string;
}

export class OrderFactory {
  create({ id, vehicleId, cpf, status }: IOrder): Order {
    return new Order({ id, vehicleId, cpf, status });
  }
}
