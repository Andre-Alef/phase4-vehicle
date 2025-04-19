import { ICard } from "./card-payment";
import { IPaymentMeta } from "./payment-meta";

export interface IPayment {
  pay(data: IPaymentMeta): void;
  payByCard(data: ICard): void;
}
