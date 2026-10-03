import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Gift, PackageCheck, Truck, XCircle, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_META: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  ORDER_PLACED: { label: "Order Placed", icon: Clock, className: "bg-amber-100 text-amber-800" },
  STORE_ACCEPTED: { label: "Store Accepted", icon: CheckCircle2, className: "bg-blue-100 text-blue-800" },
  PREPARING_GIFT: { label: "Preparing Gift", icon: Gift, className: "bg-purple-100 text-purple-800" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", icon: PackageCheck, className: "bg-indigo-100 text-indigo-800" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, className: "bg-sky-100 text-sky-800" },
  DELIVERED: { label: "Delivered", icon: PartyPopper, className: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rejected", icon: XCircle, className: "bg-red-100 text-red-800" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, icon: Clock, className: "bg-gray-100 text-gray-800" };
  const Icon = meta.icon;
  return (
    <Badge className={cn(meta.className)}>
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </Badge>
  );
}
