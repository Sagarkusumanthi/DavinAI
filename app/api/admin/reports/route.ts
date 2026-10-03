import { NextResponse } from "next/server";
import { getBasicReports } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const reports = await getBasicReports();
    return NextResponse.json(reports);
  } catch (err) {
    return handleApiError(err);
  }
}
