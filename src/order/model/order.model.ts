import { randomUUID } from "crypto";

interface IOrder {
  id?: string;
  vehicleId: string;
  userId: string;
  status: string;
}
export class Order {
  readonly #id: string;
  readonly #vehicleId: string;
  readonly #userId: string;
  #status: string;

  constructor({ id = randomUUID(), vehicleId, userId, status }: IOrder) {
    this.#id = id;
    this.#vehicleId = vehicleId;
    this.#userId = userId;
    this.#status = status;
  }
  get id(): string {
    return this.#id;
  }

  get vehicleId(): string {
    return this.#vehicleId;
  }

  get userId(): string {
    return this.#userId;
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
