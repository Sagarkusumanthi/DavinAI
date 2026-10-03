import { NextResponse } from "next/server";
import { getOrderForCustomer } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole("CUSTOMER");
    const { id } = await params;
    const order = await getOrderForCustomer(id, session.userId);
    return NextResponse.json({ order });
  } catch (err) {
    return handleApiError(err);
  }
}
