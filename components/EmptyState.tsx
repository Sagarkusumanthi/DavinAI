import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-blush/50 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-rose">
        <Gift className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {actionLabel && href && (
        <Button onClick={() => (window.location.href = href)}>{actionLabel}</Button>
      )}
      {actionLabel && onAction && !href && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
