import { Vehicle } from "../model/vehicle.model";
import { VehicleFactory } from "./vehicle.factory";

describe("VehicleFactory", () => {
  let factory: VehicleFactory;

  beforeEach(() => {
    factory = new VehicleFactory();
  });

  it("should create a Vehicle instance with the provided attributes", () => {
    const vehicleData = {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      color: "Red",
      price: 20000,
      isAvailable: true,
    };

    const vehicle = factory.create(vehicleData);

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.id).toBe(vehicleData.id);
    expect(vehicle.brand).toBe(vehicleData.brand);
    expect(vehicle.model).toBe(vehicleData.model);
    expect(vehicle.year).toBe(vehicleData.year);
    expect(vehicle.color).toBe(vehicleData.color);
    expect(vehicle.price).toBe(vehicleData.price);
    expect(vehicle.isAvailable).toBe(vehicleData.isAvailable);
  });
});
