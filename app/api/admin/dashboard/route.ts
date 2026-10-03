import { NextRequest, NextResponse } from "next/server";
import { getAdminDashboard } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole("ADMIN");
    const cityId = req.nextUrl.searchParams.get("cityId") || undefined;
    const data = await getAdminDashboard(cityId);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
