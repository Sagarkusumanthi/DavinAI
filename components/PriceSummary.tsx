import { formatINR } from "@/lib/utils";

export function PriceSummary({
  subtotal,
  deliveryFee,
  total,
}: {
  subtotal: number | string;
  deliveryFee: number | string;
  total: number | string;
}) {
  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between text-muted">
        <span>Subtotal</span>
        <span>{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between text-muted">
        <span>Delivery fee</span>
        <span>{formatINR(deliveryFee)}</span>
      </div>
      <div className="flex justify-between border-t border-ink/10 pt-1.5 font-semibold text-ink">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>
    </div>
  );
}
