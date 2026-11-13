import { describe, it, expect } from "vitest";
import { validatePayment } from "./validation";

describe("Payment validation", () => {
  const base = {
    email: "ADA@EXAMPLE.COM",
    sku: "lamp",
    externalChargeId: "ch_12345678",
    extraCode: "cushion",
  };
  it("rejects cushion with lamp", () => {
    const result = validatePayment(base);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.errors.extraCode).toBe(
        "That extra is not sold with this item",
      );
    }
  });
  it("normalizes email", () => {
    const result = validatePayment({
      ...base,
      extraCode: null,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });
});
