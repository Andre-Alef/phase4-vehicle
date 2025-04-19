import { IPaymentMeta } from "../../payment/interfaces/payment-meta";
import { PaymentService } from "../../payment/service/payment.service";
import { VehicleService } from "../../vehicle/service/vehicle.service";
import { OrderFactory } from "../factory/order.factory";
import { Order } from "../model/order.model";
import { IOrderRepository } from "../repository/order.repository";

interface ICreateOrder {
  userId: string;
  vehicleId: string;
  status: string;
  paymentInfo: IPaymentMeta;
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
    readonly vehicleService: VehicleService,
    readonly paymentService: PaymentService
  ) {}
  async create({
    vehicleId,
    userId,
    status,
    paymentInfo,
  }: ICreateOrder): Promise<Order> {
    const order: Order = this.orderFactory.create({
      vehicleId,
      userId,
      status,
    });

    const vehicle = await this.vehicleService.get(order.vehicleId);

    if (!vehicle?.isAvailable) throw new Error("Vehicle is not available");
    if (!this.paymentService.pay(paymentInfo))
      throw new Error("Payment failed");

    order.status = "Success";
    const createdOrder: Order = await this.orderRepository.save(order);
    this.vehicleService.update({
      id: order.vehicleId,
      isAvailable: false,
    });
    return createdOrder;
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
