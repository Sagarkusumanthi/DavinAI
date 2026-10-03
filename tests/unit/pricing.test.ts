import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { calculateTotals, calculateCartTotals, getDeliveryFee } from "@/lib/services/pricing";

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

  it("sums multiple cart lines correctly", () => {
    const lines = [
      { unitPrice: new Prisma.Decimal(1299), quantity: 2 },
      { unitPrice: new Prisma.Decimal(499), quantity: 1 },
    ];
    const { subtotal, deliveryFee, total } = calculateCartTotals(lines, "STANDARD");
    expect(subtotal.toNumber()).toBe(3097); // 1299*2 + 499
    expect(deliveryFee.toNumber()).toBe(49);
    expect(total.toNumber()).toBe(3146);
  });

  it("returns zero subtotal for an empty cart", () => {
    const { subtotal, total } = calculateCartTotals([], "EXPRESS");
    expect(subtotal.toNumber()).toBe(0);
    expect(total.toNumber()).toBe(99);
  });
});
