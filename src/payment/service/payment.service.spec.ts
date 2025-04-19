import { test } from "node:test";
import assert from "node:assert/strict";
import { PaymentService } from "./payment.service";

test("should not throw when payment is successful", () => {
  const service = new PaymentService();
  assert.doesNotThrow(() => {
    service.pay({ type: "card", meta: "VALID_CARD" });
  });
});

test("should throw when card is FAIL_PAYMENT", () => {
  const service = new PaymentService();
  assert.throws(() => {
    service.pay({ type: "card", meta: "FAIL_PAYMENT" });
  }, /Payment failed/);
});

test("should throw if type is not card", () => {
  const service = new PaymentService();
  assert.throws(() => {
    service.pay({ type: "pix", meta: "ANYTHING" });
  }, /Method not implemented/);
});
