import { randomUUID } from "crypto";

interface IOrder {
  id?: string;
  vehicleId: string;
  cpf: string;
  status: string;
}
export class Order {
  readonly #id: string;
  readonly #vehicleId: string;
  readonly #cpf: string;
  #status: string;

  constructor({ id = randomUUID(), vehicleId, cpf, status }: IOrder) {
    this.#id = id;
    this.#vehicleId = vehicleId;
    this.#cpf = cpf;
    this.#status = status;
  }
  get id(): string {
    return this.#id;
  }

  get vehicleId(): string {
    return this.#vehicleId;
  }

  get cpf(): string {
    return this.#cpf;
  }

  get status(): string {
    return this.#status;
  }

  set status(status: string | undefined) {
    if (status) {
      this.#status = status;
    }
  }
}
