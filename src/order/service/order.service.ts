import { IVehicleRepository } from "../../vehicle/repository/vehicle.repository";
import { OrderFactory } from "../factory/order.factory";
import { Order } from "../model/order.model";
import { IOrderRepository } from "../repository/order.repository";

interface ICreateOrder {
  userId: string;
  vehicleId: string;
  status: string;
}

interface IUpdateOrder {
  id: string;
  userId: string;
  vehicleId: string;
  status: string;
}

export class OrderService {
  constructor(
    readonly orderRepository: IOrderRepository,
    readonly orderFactory: OrderFactory,
    readonly vehicleRepository: IVehicleRepository
  ) {}
  async create({ vehicleId, userId, status }: ICreateOrder): Promise<Order> {
    const order: Order = this.orderFactory.create({
      vehicleId,
      userId,
      status,
    });

    const vehicle = await this.vehicleRepository.get(order.vehicleId);

    if (vehicle?.isAvailable) throw new Error("Vehicle is not available");

    return this.orderRepository.save(order);
  }

  async update({ id, status }: IUpdateOrder): Promise<Order> {
    const order: Order = await this.get(id);

    order.status = status;

    return this.orderRepository.save(order);
  }

  async list(isAvailable: boolean): Promise<Order[]> {
    return this.orderRepository.list(isAvailable);
  }

  async get(id: string): Promise<Order> {
    return this.orderRepository.get(id);
  }
}
