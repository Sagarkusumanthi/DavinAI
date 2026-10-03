import { NextResponse } from "next/server";
import { getStoreDashboard } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireRole("STORE_OWNER");
    const dashboard = await getStoreDashboard(session.userId);
    return NextResponse.json(dashboard);
  } catch (err) {
    return handleApiError(err);
  }
}
