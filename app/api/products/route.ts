import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/services/catalogue";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const cityId = sp.get("cityId");
    if (!cityId) throw new ValidationError("cityId is required.");
    const products = await listProducts({
      cityId,
      categorySlug: sp.get("category") ?? undefined,
      query: sp.get("q") ?? undefined,
      sort: (sp.get("sort") as "newest" | "price_asc" | "price_desc") ?? undefined,
    });
    return NextResponse.json({ products });
  } catch (err) {
    return handleApiError(err);
  }
}
