import axios from "axios";
import { VehicleService } from "../../vehicle/service/vehicle.service";
import { OrderFactory } from "../factory/order.factory";
import { Order } from "../model/order.model";
import { IOrderRepository } from "../repository/order.repository";

interface ICreateOrder {
  cpf: string;
  vehicleId: string;
  //date: Date;
}

interface IFinishOrder {
  id: string;
  paymentInfo: "success" | "fail";
}

interface IUpdateOrder {
  id: string;
  status: string;
}
const URL = "http://phase4:3000";
export class OrderService {
  constructor(
    readonly orderRepository: IOrderRepository,
    readonly orderFactory: OrderFactory,
    readonly vehicleService: VehicleService
  ) {}

  async create({ vehicleId, cpf }: ICreateOrder): Promise<Order> {
    const order: Order = this.orderFactory.create({
      vehicleId,
      cpf,
      status: "Placed",
    });

    const vehicle = await this.vehicleService.get(order.vehicleId);

    if (!vehicle?.isAvailable) throw new Error("Vehicle is not available");

    const createdOrder: Order = await this.orderRepository.save(order);

    await this.vehicleService.update({
      id: order.vehicleId,
      isAvailable: false,
    });

    try {
      const response = await axios.patch(`${URL}/vehicles/availability`, {
        id: vehicle.id,
        isAvailable: false,
      });
      console.log("Veículo criado com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
    }

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

  async finishOrder({ id, paymentInfo }: IFinishOrder): Promise<Order> {
    let order = await this.get(id);
    const vehicle = await this.vehicleService.get(order.vehicleId);

    if (paymentInfo === "success") {
      order = await this.update({
        id: order.id,
        status: "Success",
      });
    } else {
      order = await this.update({
        id: order.id,
        status: "Failed",
      });
      await this.vehicleService.update({
        id: order.vehicleId,
        isAvailable: true,
      });
    }

    try {
      const response = await axios.patch(`${URL}/vehicles/availability`, {
        id: vehicle.id,
        isAvailable: paymentInfo === "success" ? false : true,
      });
      console.log("Veículo criado com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
    }

    return order;
  }
}
