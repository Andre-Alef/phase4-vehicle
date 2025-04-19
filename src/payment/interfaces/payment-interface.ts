import { ICard } from "./card-payment";
import { IPaymentMeta } from "./payment-meta";

export interface IPayment {
  pay(data: IPaymentMeta): boolean;
  payByCard(data: ICard): boolean;
}
