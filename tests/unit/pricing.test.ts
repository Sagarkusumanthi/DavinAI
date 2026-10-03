import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { calculateTotals, getDeliveryFee } from "@/lib/services/pricing";

describe("pricing", () => {
  it("calculates subtotal, delivery fee, and total correctly for standard delivery", () => {
    const { subtotal, deliveryFee, total } = calculateTotals(new Prisma.Decimal(1499), 1, "STANDARD");
    expect(subtotal.toNumber()).toBe(1499);
    expect(deliveryFee.toNumber()).toBe(49);
    expect(total.toNumber()).toBe(1548);
  });

  it("multiplies by quantity", () => {
    const { subtotal, total } = calculateTotals(new Prisma.Decimal(500), 3, "EXPRESS");
    expect(subtotal.toNumber()).toBe(1500);
    expect(total.toNumber()).toBe(1599);
  });

  it("uses the correct fee per delivery option", () => {
    expect(getDeliveryFee("STANDARD").toNumber()).toBe(49);
    expect(getDeliveryFee("EXPRESS").toNumber()).toBe(99);
    expect(getDeliveryFee("SCHEDULED").toNumber()).toBe(79);
  });
});
