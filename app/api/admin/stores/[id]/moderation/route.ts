import { NextRequest, NextResponse } from "next/server";
import { setStoreModeration } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError, ValidationError } from "@/lib/api-errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ status: z.enum(["PENDING", "APPROVED", "BLOCKED"]) });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid moderation status.");
    const store = await setStoreModeration(id, parsed.data.status);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}
