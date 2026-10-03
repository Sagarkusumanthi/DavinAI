import { NextRequest, NextResponse } from "next/server";
import { confirmDeliveryByCustomer } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { confirmDeliverySchema } from "@/lib/validation";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { id } = await params;
    const body = await req.json();
    const parsed = confirmDeliverySchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError("A delivery photo is required.", parsed.error.flatten().fieldErrors as any);
    }
    const order = await confirmDeliveryByCustomer(id, session.userId, parsed.data.proofImage);
    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
