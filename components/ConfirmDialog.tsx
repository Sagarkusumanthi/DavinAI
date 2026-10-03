"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ConfirmDialog({
  trigger,
  title,
  description,
  requireReason,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  requireReason?: boolean;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: (reason?: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (requireReason && reason.trim().length < 3) {
      setError("Please provide a reason (min 3 characters).");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(requireReason ? reason.trim() : undefined);
      setOpen(false);
      setReason("");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <DialogContent>
          <DialogTitle className="text-lg font-semibold text-ink">{title}</DialogTitle>
          {description && <DialogDescription className="mt-1 text-sm text-muted">{description}</DialogDescription>}
          {requireReason && (
            <div className="mt-4">
              <Label htmlFor="confirm-reason">Reason</Label>
              <Textarea id="confirm-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why..." />
            </div>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant={destructive ? "destructive" : "primary"} disabled={submitting} onClick={handleConfirm}>
              {submitting ? "Please wait..." : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
