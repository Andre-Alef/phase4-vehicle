import request from "supertest";
import express from "express";
import { vehicleController } from "../../src/vehicle/controller";
const app = express();
app.use(express.json());
app.use("/vehicles", vehicleController);

describe("Vehicle Controller Endpoints", () => {
  let vehicleId: string;

  it("should create a new vehicle", async () => {
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

    expect(response.body).toHaveProperty("id");
    expect(response.body.brand).toBe(newVehicle.brand);
    vehicleId = response.body.id;
  });

  it("should update vehicle availability", async () => {
    const updatedData = { id: vehicleId, isAvailable: false };

    const response = await request(app)
      .patch("/vehicles")
      .send(updatedData)
      .expect(200);

    expect(response.body.isAvailable).toBe(updatedData.isAvailable);
  });

  it("should retrieve a vehicle by ID", async () => {
    const response = await request(app)
      .get(`/vehicles/${vehicleId}`)
      .expect(200);

    expect(response.body.id).toBe(vehicleId);
  });
});
