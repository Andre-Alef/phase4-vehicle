import { Vehicle } from "../model/vehicle.model";
import { PrismaClient, Vehicle as VehiclePrisma } from "@prisma/client";
export interface IVehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  list(isAvailable: boolean | undefined): Promise<Vehicle[]>;
  get(id: string): Promise<Vehicle>;
}

export class VehicleRepository implements IVehicleRepository {
  constructor(readonly prisma = new PrismaClient()) {} //TODO: make it global
  async save({
    id,
    brand,
    model,
    year,
    color,
    price,
    isAvailable,
  }: Vehicle): Promise<Vehicle> {
    const createdVehicle: VehiclePrisma = await this.prisma.vehicle.upsert({
      where: { id },
      create: {
        id,
        brand,
        model,
        year,
        color,
        price,
        isAvailable,
      },
      update: {
        brand,
        model,
        year,
        color,
        price,
        isAvailable,
      },
    });

    return new Vehicle({
      id: createdVehicle.id,
      brand: createdVehicle.brand,
      model: createdVehicle.model,
      year: createdVehicle.year,
      color: createdVehicle.color,
      price: createdVehicle.price,
      isAvailable: createdVehicle.isAvailable,
    });
  }
  async list(isAvailable: boolean | undefined): Promise<Vehicle[]> {
    const vehicles: VehiclePrisma[] = await this.prisma.vehicle.findMany({
      where: { isAvailable },
      orderBy: { price: "asc" },
    });

    return vehicles.map(
      (vehicle: VehiclePrisma) =>
        new Vehicle({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          price: vehicle.price,
          isAvailable: vehicle.isAvailable,
        })
    );
  }
  async get(id: string): Promise<Vehicle> {
    const vehicle: VehiclePrisma | null = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) throw new Error("Vehicle not found");

    return new Vehicle({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      isAvailable: vehicle.isAvailable,
    });
  }
}
