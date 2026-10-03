import { NextRequest, NextResponse } from "next/server";
import { getStoreDetail, setStoreOpen } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError, ValidationError } from "@/lib/api-errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    const detail = await getStoreDetail(id);
    return NextResponse.json(detail);
  } catch (err) {
    return handleApiError(err);
  }
}

const bodySchema = z.object({ isOpen: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("isOpen must be a boolean.");
    const store = await setStoreOpen(id, parsed.data.isOpen);
    return NextResponse.json({ store });
  } catch (err) {
    return handleApiError(err);
  }
}
