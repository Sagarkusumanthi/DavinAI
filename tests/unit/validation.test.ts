import { describe, it, expect } from "vitest";
import { recipientSchema, giftSchema, checkoutSchema } from "@/lib/validation";

describe("recipient validation", () => {
  it("rejects a phone number not starting with 6-9", () => {
    const result = recipientSchema.safeParse({
      recipientName: "Test User",
      recipientPhone: "5123456789",
      deliveryAddress: "123 Some Long Enough Street",
    });
    expect(result.success).toBe(false);
  });
  it("accepts a valid 10-digit phone starting with 6-9", () => {
    const result = recipientSchema.safeParse({
      recipientName: "Test User",
      recipientPhone: "9876543210",
      deliveryAddress: "123 Some Long Enough Street",
    });
    expect(result.success).toBe(true);
  });
  it("rejects an address under 10 characters", () => {
    const result = recipientSchema.safeParse({
      recipientName: "Test User",
      recipientPhone: "9876543210",
      deliveryAddress: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("gift message validation", () => {
  it("rejects a message over 250 characters", () => {
    const result = giftSchema.safeParse({
      giftMessage: "a".repeat(251),
      occasion: "Birthday",
      senderName: "Test",
    });
    expect(result.success).toBe(false);
  });
  it("accepts an empty message", () => {
    const result = giftSchema.safeParse({ giftMessage: "", occasion: "Birthday", senderName: "Test" });
    expect(result.success).toBe(true);
  });
});

describe("checkout schema", () => {
  const base = {
    recipientName: "Test User",
    recipientPhone: "9876543210",
    deliveryAddress: "123 Some Long Enough Street",
    occasion: "Birthday" as const,
    senderName: "Sender",
    paymentMethod: "COD" as const,
    productId: "prod_1",
    quantity: 2,
    cityId: "city_1",
    idempotencyKey: "0123456789abcdef",
  };

  it("requires date and slot when SCHEDULED", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryOption: "SCHEDULED" });
    expect(result.success).toBe(false);
  });

  it("passes when SCHEDULED with date and slot provided", () => {
    const result = checkoutSchema.safeParse({
      ...base,
      deliveryOption: "SCHEDULED",
      deliveryDate: "2099-01-01",
      deliverySlot: "MORNING",
    });
    expect(result.success).toBe(true);
  });

  it("does not require date/slot for STANDARD", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryOption: "STANDARD" });
    expect(result.success).toBe(true);
  });

  it("rejects quantity above 10", () => {
    const result = checkoutSchema.safeParse({ ...base, deliveryOption: "STANDARD", quantity: 11 });
    expect(result.success).toBe(false);
  });
});
