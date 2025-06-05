// src/__tests__/vehicle.repository.test.ts
import { PrismaClient, Vehicle as VehiclePrisma } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

import { Vehicle } from "../model/vehicle.model";
import { VehicleRepository } from "./vehicle.repository";

// Mocking Prisma Client
const prismaMock = mockDeep<PrismaClient>();
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

describe("VehicleRepository", () => {
  let repository: VehicleRepository;

  beforeEach(() => {
    repository = new VehicleRepository(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("save", () => {
    it("should save a new vehicle", async () => {
      const vehicleData = {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "Red",
        price: 20000,
        isAvailable: true,
      };

      const mockVehicle = {
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.vehicle.upsert.mockResolvedValue(mockVehicle as VehiclePrisma);

      const vehicle = await repository.save(new Vehicle(vehicleData));

      expect(vehicle).toEqual(new Vehicle(mockVehicle));
      expect(prismaMock.vehicle.upsert).toHaveBeenCalledWith({
        where: { id: vehicleData.id },
        create: vehicleData,
        update: {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          price: vehicle.price,
          isAvailable: vehicle.isAvailable,
        },
      });
    });
  });

  describe("list", () => {
    it("should list vehicles by availability", async () => {
      const mockVehicles = [
        {
          id: "1",
          brand: "Toyota",
          model: "Corolla",
          year: 2022,
          color: "Red",
          price: 20000,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          brand: "Honda",
          model: "Civic",
          year: 2021,
          color: "Blue",
          price: 18000,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.vehicle.findMany.mockResolvedValue(
        mockVehicles as VehiclePrisma[]
      );

      const vehicles = await repository.list(true);

      expect(vehicles).toHaveLength(2);
      expect(vehicles[0]).toEqual(new Vehicle(mockVehicles[0]));
      expect(prismaMock.vehicle.findMany).toHaveBeenCalledWith({
        where: { isAvailable: true },
        orderBy: { price: "asc" },
      });
    });
  });

  describe("get", () => {
    it("should get a vehicle by ID", async () => {
      const mockVehicle = {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "Red",
        price: 20000,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.vehicle.findUnique.mockResolvedValue(
        mockVehicle as VehiclePrisma
      );

      const vehicle = await repository.get("1");

      expect(vehicle).toEqual(new Vehicle(mockVehicle));
      expect(prismaMock.vehicle.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw an error if vehicle not found", async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(null);

      await expect(repository.get("1")).rejects.toThrow("Vehicle not found");
    });
  });
});
