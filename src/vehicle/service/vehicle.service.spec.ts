import { VehicleService } from "./vehicle.service";
import { VehicleFactory } from "../factory/vehicle.factory";
import { IVehicleRepository } from "../repository/vehicle.repository";
import { Vehicle } from "../model/vehicle.model";

describe("VehicleService", () => {
  let vehicleRepositoryMock: jest.Mocked<IVehicleRepository>;
  let vehicleFactoryMock: jest.Mocked<VehicleFactory>;
  let vehicleService: VehicleService;

  beforeEach(() => {
    vehicleRepositoryMock = {
      save: jest.fn(),
      get: jest.fn(),
      list: jest.fn(),
    };

    vehicleFactoryMock = {
      create: jest.fn(),
    } as any;

    vehicleService = new VehicleService(
      vehicleRepositoryMock,
      vehicleFactoryMock
    );
  });

  describe("create", () => {
    it("should create and save a vehicle", async () => {
      const input = {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "Blue",
        price: 25000,
        isAvailable: true,
      };

      const createdVehicle = new Vehicle(input);
      vehicleFactoryMock.create.mockReturnValue(createdVehicle);
      vehicleRepositoryMock.save.mockResolvedValue(createdVehicle);

      const result = await vehicleService.create(input);

      expect(vehicleFactoryMock.create).toHaveBeenCalledWith({
        id: input.id,
        brand: input.brand,
        model: input.model,
        year: input.year,
        color: input.color,
        price: input.price,
        isAvailable: true,
      });
      expect(vehicleRepositoryMock.save).toHaveBeenCalledWith(createdVehicle);
      expect(result).toBe(createdVehicle);
    });
  });

  describe("update", () => {
    it("should get vehicle, update properties, and save", async () => {
      const existingVehicle = new Vehicle({
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "Blue",
        price: 25000,
        isAvailable: true,
      });

      vehicleRepositoryMock.get.mockResolvedValue(existingVehicle);
      vehicleRepositoryMock.save.mockResolvedValue(existingVehicle);

      const updateData = {
        id: "1",
        brand: "Honda",
        model: "Civic",
        year: 2023,
        color: "Red",
        price: 27000,
        isAvailable: false,
      };

      const result = await vehicleService.update(updateData);

      expect(vehicleRepositoryMock.get).toHaveBeenCalledWith(updateData.id);
      expect(existingVehicle.brand).toBe(updateData.brand);
      expect(existingVehicle.model).toBe(updateData.model);
      expect(existingVehicle.year).toBe(updateData.year);
      expect(existingVehicle.color).toBe(updateData.color);
      expect(existingVehicle.price).toBe(updateData.price);
      expect(existingVehicle.isAvailable).toBe(updateData.isAvailable);
      expect(vehicleRepositoryMock.save).toHaveBeenCalledWith(existingVehicle);
      expect(result).toBe(existingVehicle);
    });
  });

  describe("list", () => {
    it("should call repository list with isAvailable parameter", async () => {
      const vehicles = [
        new Vehicle({
          id: "1",
          brand: "Toyota",
          model: "Corolla",
          year: 2022,
          color: "Blue",
          price: 25000,
          isAvailable: true,
        }),
      ];

      vehicleRepositoryMock.list.mockResolvedValue(vehicles);

      const result = await vehicleService.list(true);

      expect(vehicleRepositoryMock.list).toHaveBeenCalledWith(true);
      expect(result).toBe(vehicles);
    });
  });

  describe("get", () => {
    it("should call repository get with id", async () => {
      const vehicle = new Vehicle({
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "Blue",
        price: 25000,
        isAvailable: true,
      });

      vehicleRepositoryMock.get.mockResolvedValue(vehicle);

      const result = await vehicleService.get("1");

      expect(vehicleRepositoryMock.get).toHaveBeenCalledWith("1");
      expect(result).toBe(vehicle);
    });
  });
});
