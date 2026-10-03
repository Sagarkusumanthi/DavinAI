import { NextResponse } from "next/server";
import { getReturnsAnalytics } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const data = await getReturnsAnalytics();
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
