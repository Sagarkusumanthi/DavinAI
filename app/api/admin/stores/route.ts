import { NextRequest, NextResponse } from "next/server";
import { listAllStores } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole("ADMIN");
    const sp = req.nextUrl.searchParams;
    const stores = await listAllStores({
      cityId: sp.get("cityId") ?? undefined,
      categoryId: sp.get("categoryId") ?? undefined,
    });
    return NextResponse.json({ stores });
  } catch (err) {
    return handleApiError(err);
  }
}
