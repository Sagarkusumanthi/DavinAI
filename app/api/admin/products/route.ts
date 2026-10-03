import { NextRequest, NextResponse } from "next/server";
import { listAllProducts } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireRole("ADMIN");
    const sp = req.nextUrl.searchParams;
    const products = await listAllProducts({
      storeId: sp.get("storeId") ?? undefined,
      cityId: sp.get("cityId") ?? undefined,
      categoryId: sp.get("categoryId") ?? undefined,
      availableOnly: sp.get("availableOnly") === "true" ? true : undefined,
    });
    return NextResponse.json({ products });
  } catch (err) {
    return handleApiError(err);
  }
}
