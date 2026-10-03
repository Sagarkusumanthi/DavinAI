import { NextResponse } from "next/server";
import { listOrdersForStoreOwner } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireRole("STORE_OWNER");
    const orders = await listOrdersForStoreOwner(session.userId);
    return NextResponse.json({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}
