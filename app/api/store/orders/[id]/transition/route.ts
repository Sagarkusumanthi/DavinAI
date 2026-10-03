import { NextRequest, NextResponse } from "next/server";
import { transitionOrderAsStoreOwner } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { handleApiError, ValidationError } from "@/lib/api-errors";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  targetStatus: z.enum(["STORE_ACCEPTED", "PREPARING_GIFT", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "REJECTED"]),
  expectedVersion: z.number().int(),
  reason: z.string().trim().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("STORE_OWNER");
    const { id } = await params;
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) throw new ValidationError("Invalid request.");
    const order = await transitionOrderAsStoreOwner({
      orderId: id,
      ownerUserId: session.userId,
      targetStatus: parsed.data.targetStatus,
      expectedVersion: parsed.data.expectedVersion,
      reason: parsed.data.reason,
    });
    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
