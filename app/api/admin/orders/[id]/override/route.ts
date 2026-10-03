import { NextRequest, NextResponse } from "next/server";
import { transitionOrderAsAdmin } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { adminOverrideSchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = adminOverrideSchema.merge(z.object({ expectedVersion: z.number().int() }));

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("ADMIN");
    const { id } = await params;
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("Please check the highlighted fields.", parsed.error.flatten().fieldErrors as any);
    }
    const order = await transitionOrderAsAdmin({
      orderId: id,
      adminUserId: session.userId,
      targetStatus: parsed.data.targetStatus,
      reason: parsed.data.reason,
      expectedVersion: parsed.data.expectedVersion,
    });
    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
