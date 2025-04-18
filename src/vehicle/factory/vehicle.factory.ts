import { Vehicle } from "../model/vehicle.model";

interface IVehicle {
  id?: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  isAvailable: boolean;
}

export class VehicleFactory {
  create({
    id,
    brand,
    model,
    year,
    color,
    price,
    isAvailable,
  }: IVehicle): Vehicle {
    return new Vehicle({ id, brand, model, year, color, price, isAvailable });
  }
}
