import { VehicleFactory } from "../factory/vehicle.factory";
import { Vehicle } from "../model/vehicle.model";
import { IVehicleRepository } from "../repository/vehicle.repository";

interface ICreateVehicle {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  isAvailable: boolean;
}

interface IUpdateVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  isAvailable: boolean;
}

export class VehicleService {
  constructor(
    readonly vehicleRepository: IVehicleRepository,
    readonly vehicleFactory: VehicleFactory
  ) {}
  async create({
    brand,
    model,
    year,
    color,
    price,
    isAvailable,
  }: ICreateVehicle): Promise<Vehicle> {
    const vehicle: Vehicle = this.vehicleFactory.create({
      brand,
      model,
      year,
      color,
      price,
      isAvailable,
    });

    const created = await this.vehicleRepository.save(vehicle);
    console.log(created);
    return created;
  }

  async update({
    id,
    brand,
    model,
    year,
    color,
    price,
    isAvailable,
  }: IUpdateVehicle): Promise<Vehicle> {
    const vehicle: Vehicle = await this.get(id);

    vehicle.brand = brand;
    vehicle.model = model;
    vehicle.year = year;
    vehicle.color = color;
    vehicle.price = price;
    vehicle.isAvailable = isAvailable;

    return this.vehicleRepository.save(vehicle);
  }

  async list(isAvailable: boolean | undefined): Promise<Vehicle[]> {
    return this.vehicleRepository.list(isAvailable);
  }

  async get(id: string): Promise<Vehicle> {
    return this.vehicleRepository.get(id);
  }
}
