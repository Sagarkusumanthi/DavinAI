import { NextResponse } from "next/server";
import { getStoreReports } from "@/lib/services/storeOwner";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireRole("STORE_OWNER");
    const reports = await getStoreReports(session.userId);
    return NextResponse.json(reports);
  } catch (err) {
    return handleApiError(err);
  }
}
