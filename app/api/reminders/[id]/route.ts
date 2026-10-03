import { NextRequest, NextResponse } from "next/server";
import { updateReminder, deleteReminder } from "@/lib/services/reminders";
import { requireRole } from "@/lib/session";
import { reminderSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { id } = await params;
    const body = await req.json();
    const parsed = reminderSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const reminder = await updateReminder(session.userId, id, parsed.data);
    return NextResponse.json({ reminder });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { id } = await params;
    await deleteReminder(session.userId, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
