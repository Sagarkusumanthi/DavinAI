import { NextResponse } from "next/server";
import { getAdminDashboard } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const data = await getAdminDashboard();
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
