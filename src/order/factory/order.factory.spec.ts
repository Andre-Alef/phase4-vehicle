// src/__tests__/order.factory.test.ts
import { OrderFactory } from "./order.factory";
import { Order } from "../model/order.model";

describe("OrderFactory", () => {
  let factory: OrderFactory;

  beforeEach(() => {
    factory = new OrderFactory();
  });

  it("should create an Order instance with the provided attributes", () => {
    const orderData = {
      id: "1",
      vehicleId: "v1",
      cpf: "12345678901",
      status: "pending",
    };

    const order = factory.create(orderData);

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe(orderData.id);
    expect(order.vehicleId).toBe(orderData.vehicleId);
    expect(order.cpf).toBe(orderData.cpf);
    expect(order.status).toBe(orderData.status);
  });
});
