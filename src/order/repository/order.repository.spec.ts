// src/__tests__/order.repository.test.ts
import { PrismaClient, Order as OrderPrisma } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { Order } from "../model/order.model";
import { OrderRepository } from "./order.repository";

// Mocking Prisma Client
const prismaMock = mockDeep<PrismaClient>();
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

describe("OrderRepository", () => {
  let repository: OrderRepository;

  beforeEach(() => {
    repository = new OrderRepository(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should save a new order", async () => {
      const orderData = {
        id: "1",
        status: "pending",
        vehicleId: "v1",
        cpf: "12345678901",
        date: new Date(),
      };

      const mockOrder = {
        ...orderData,
      };

      prismaMock.order.upsert.mockResolvedValue(mockOrder as OrderPrisma);

      const order = await repository.save(new Order(orderData));

      expect(order).toEqual(new Order(mockOrder));
      expect(prismaMock.order.upsert).toHaveBeenCalledWith({
        where: { id: orderData.id },
        create: orderData,
        update: { status: orderData.status },
      });
    });
  });

  describe("list", () => {
    it("should list all orders", async () => {
      const mockOrders = [
        {
          id: "1",
          status: "pending",
          vehicleId: "v1",
          cpf: "12345678901",
          date: new Date(),
        },
        {
          id: "2",
          status: "completed",
          vehicleId: "v2",
          cpf: "10987654321",
          date: new Date(),
        },
      ];

      prismaMock.order.findMany.mockResolvedValue(mockOrders as OrderPrisma[]);

      const orders = await repository.list();

      expect(orders).toHaveLength(2);
      expect(orders[0]).toEqual(new Order(mockOrders[0]));
      expect(prismaMock.order.findMany).toHaveBeenCalledWith({});
    });
  });

  describe("get", () => {
    it("should get an order by ID", async () => {
      const mockOrder = {
        id: "1",
        status: "pending",
        vehicleId: "v1",
        cpf: "12345678901",
        date: new Date(),
      };

      prismaMock.order.findUniqueOrThrow.mockResolvedValue(
        mockOrder as OrderPrisma
      );

      const order = await repository.get("1");

      expect(order).toEqual(new Order(mockOrder));
      expect(prismaMock.order.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw an error if order not found", async () => {
      prismaMock.order.findUniqueOrThrow.mockRejectedValue(
        new Error("Order not found")
      );

      await expect(repository.get("1")).rejects.toThrow("Order not found");
    });
  });
});
