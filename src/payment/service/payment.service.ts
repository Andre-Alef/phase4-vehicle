import { ICard } from "../interfaces/card-payment";
import { IPayment } from "../interfaces/payment-interface";
import { IPaymentMeta } from "../interfaces/payment-meta";

export class PaymentService implements IPayment {
  constructor() {}
  pay(data: IPaymentMeta): boolean {
    if (data?.type === "card") return this.payByCard({ card: data.meta });
    throw new Error("Method not implemented.");
  }
  payByCard({ card }: ICard): boolean {
    if (card === "FAIL_PAYMENT") return false;
    else return true;
  }
}
