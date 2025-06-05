import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { orderController } from "../../src/order/controller";
import { vehicleController } from "../../src/vehicle/controller";

const app = express();
app.use(bodyParser.json());
app.use("/orders", orderController);
app.use("/vehicles", vehicleController);

describe("Order Controller Endpoints (E2E)", () => {
  let createdOrderId = "";
  let testVehicleId = "";

  // Create a vehicle before all tests
  beforeAll(async () => {
    const newVehicle = {
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      color: "Blue",
      price: 20000,
      isAvailable: true,
    };

    const response = await request(app)
      .post("/vehicles")
      .send(newVehicle)
      .expect(200);

    testVehicleId = response.body.id;
  });

  it("should create a new order", async () => {
    const newOrder = {
      vehicleId: testVehicleId,
      cpf: "12345678900",
    };

    const response = await request(app)
      .post("/orders")
      .send(newOrder)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.vehicleId).toBe(newOrder.vehicleId);
    expect(response.body.cpf).toBe(newOrder.cpf);
    expect(response.body.status).toBe("Placed");

    createdOrderId = response.body.id;
  });

  it("should update an existing order", async () => {
    const updatedOrder = {
      id: createdOrderId,
      status: "confirmed",
      vehicleId: testVehicleId,
      cpf: "12345678900",
    };

    const response = await request(app)
      .patch("/orders")
      .send(updatedOrder)
      .expect(200);

    expect(response.body.id).toBe(updatedOrder.id);
    expect(response.body.status).toBe(updatedOrder.status);
  });

  it("should finish an order as failed if payment callback is fail", async () => {
    const finishOrderData = { id: createdOrderId, paymentInfo: "fail" };

    const response = await request(app)
      .post("/orders/finish")
      .send(finishOrderData)
      .expect(200);

    expect(response.body.id).toBe(finishOrderData.id);
    expect(response.body.status).toBe("Failed"); // Adjust if your logic differs
  });

  it("should finish an order as success if payment callback is success", async () => {
    const finishOrderData = { id: createdOrderId, paymentInfo: "success" };

    const response = await request(app)
      .post("/orders/finish")
      .send(finishOrderData)
      .expect(200);

    expect(response.body.id).toBe(finishOrderData.id);
    expect(response.body.status).toBe("Success"); // Adjust if your logic differs
  });

  it.skip("should get an order by ID", async () => {
    const response = await request(app)
      .get(`/orders`)
      .send({ id: createdOrderId })
      .expect(200);

    expect(response.body.id).toBe(createdOrderId);
  });

  it("should list orders", async () => {
    const response = await request(app).get("/orders").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
