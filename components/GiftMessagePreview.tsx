import { Heart } from "lucide-react";

export function GiftMessagePreview({ message, occasion, senderName }: { message?: string | null; occasion: string; senderName: string }) {
  return (
    <div className="rounded-xl border border-dashed border-rose/30 bg-blush/40 p-4">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-rose">
        <Heart className="h-3.5 w-3.5 fill-rose" />
        <span>{occasion}</span>
      </div>
      {message ? (
        <p className="text-sm italic text-ink">&ldquo;{message}&rdquo;</p>
      ) : (
        <p className="text-sm italic text-muted">No gift message added</p>
      )}
      <p className="mt-2 text-xs text-muted">- {senderName}</p>
    </div>
  );
}
