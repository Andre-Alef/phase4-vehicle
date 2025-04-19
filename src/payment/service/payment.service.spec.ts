import { test } from "node:test";
import assert from "node:assert/strict";
import { PaymentService } from "./payment.service";

test("should return true when payment is successful", () => {
  const service = new PaymentService();
  const result = service.pay({ type: "card", meta: "VALID_CARD" });
  assert.equal(result, true);
});

test("should return false when card is FAIL_PAYMENT", () => {
  const service = new PaymentService();
  const result = service.pay({ type: "card", meta: "FAIL_PAYssMENT" });
  assert.equal(result, false);
});

test("should throw if type is not card", () => {
  const service = new PaymentService();
  assert.throws(() => {
    service.pay({ type: "pix", meta: "ANYTHING" });
  }, /Method not implemented/);
});
