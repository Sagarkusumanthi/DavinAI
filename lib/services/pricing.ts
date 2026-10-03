import { Prisma } from "@prisma/client";
import { DELIVERY_FEES } from "@/lib/constants";
export { DELIVERY_FEES };

export function getDeliveryFee(option: "STANDARD" | "EXPRESS" | "SCHEDULED"): Prisma.Decimal {
  return new Prisma.Decimal(DELIVERY_FEES[option]);
}

export function calculateTotals(unitPrice: Prisma.Decimal, quantity: number, deliveryOption: "STANDARD" | "EXPRESS" | "SCHEDULED") {
  const subtotal = unitPrice.mul(quantity);
  const deliveryFee = getDeliveryFee(deliveryOption);
  const total = subtotal.add(deliveryFee);
  return { subtotal, deliveryFee, total };
}
