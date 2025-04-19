import { ICard } from "../interfaces/card-payment";
import { IPayment } from "../interfaces/payment-interface";
import { IPaymentMeta } from "../interfaces/payment-meta";

export class PaymentService implements IPayment {
  constructor() {}
  pay(data: IPaymentMeta): void {
    if (data?.type === "card") return this.payByCard({ card: data.meta });
    throw new Error("Method not implemented.");
  }
  payByCard({ card }: ICard): void {
    console.log({ card });
    if (card === "FAIL_PAYMENT") throw new Error("Payment failed.");
  }
}
