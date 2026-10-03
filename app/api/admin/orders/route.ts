import { NextRequest, NextResponse } from "next/server";
import { listOrdersForAdmin } from "@/lib/services/orders";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole("ADMIN");
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status") as OrderStatus | null;
    const orders = await listOrdersForAdmin({
      status: status ?? undefined,
      cityId: sp.get("cityId") ?? undefined,
      storeId: sp.get("storeId") ?? undefined,
      orderCode: sp.get("orderCode") ?? undefined,
    });
    return NextResponse.json({ orders });
  } catch (err) {
    return handleApiError(err);
  }
}
