import { PrismaClient, Order as OrderPrisma } from "@prisma/client";
import { Order } from "../model/order.model";

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  list(isAvailable: boolean): Promise<Order[]>;
  get(id: string): Promise<Order>;
}

export class OrderRepository implements IOrderRepository {
  constructor(readonly prisma = new PrismaClient()) {}
  async save({ id, status, vehicleId, userId }: Order): Promise<Order> {
    const createdOrder: OrderPrisma = await this.prisma.order.upsert({
      where: { id },
      create: {
        id,
        status,
        vehicleId,
        userId,
      },
      update: {
        status,
      },
    });

    return new Order({
      id: createdOrder.id,
      status: createdOrder.status,
      vehicleId: createdOrder.vehicleId,
      userId: createdOrder.userId,
    });
  }
  async list(): Promise<Order[]> {
    const orders: OrderPrisma[] = await this.prisma.order.findMany({});

    return orders.map(
      (order: OrderPrisma) =>
        new Order({
          id: order.id,
          status: order.status,
          vehicleId: order.vehicleId,
          userId: order.userId,
        })
    );
  }
  async get(id: string): Promise<Order> {
    const order: OrderPrisma = await this.prisma.order.findUniqueOrThrow({
      where: { id },
    });

    return new Order({
      id: order.id,
      status: order.status,
      vehicleId: order.vehicleId,
      userId: order.userId,
    });
  }
}
