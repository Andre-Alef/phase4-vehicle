import { randomUUID } from "crypto";

interface IVehicle {
  id?: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  isAvailable: boolean;
}
export class Vehicle {
  readonly #id: string;
  #brand: string;
  #model: string;
  #year: number;
  #color: string;
  #price: number;
  #isAvailable: boolean;

  constructor({
    id = randomUUID(),
    brand,
    model,
    year,
    color,
    price,
    isAvailable = true,
  }: IVehicle) {
    this.#id = id;
    this.#brand = brand;
    this.#model = model;
    this.#year = year;
    this.#color = color;
    this.#price = price;
    this.#isAvailable = isAvailable;
  }
  get id(): string {
    return this.#id;
  }

  get brand(): string {
    return this.#brand;
  }

  get model(): string {
    return this.#model;
  }

  get year(): number {
    return this.#year;
  }

  get color(): string {
    return this.#color;
  }

  get price(): number {
    return this.#price;
  }

  get isAvailable(): boolean {
    return this.#isAvailable;
  }

  set brand(brand: string | undefined) {
    if (brand) {
      this.#brand = brand;
    }
  }

  set model(model: string | undefined) {
    if (model) {
      this.#model = model;
    }
  }

  set year(year: number | undefined) {
    if (year) {
      this.#year = year;
    }
  }

  set color(color: string | undefined) {
    if (color) {
      this.#color = color;
    }
  }

  set price(price: number | undefined) {
    if (price) {
      this.#price = price;
    }
  }

  set isAvailable(isAvailable: boolean | undefined) {
    if (isAvailable !== undefined) {
      this.#isAvailable = isAvailable;
    }
  }
}
