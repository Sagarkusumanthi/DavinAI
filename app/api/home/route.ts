import { NextRequest, NextResponse } from "next/server";
import { getHomeCatalogue } from "@/lib/services/catalogue";
import { handleApiError, ValidationError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cityId = req.nextUrl.searchParams.get("cityId");
    if (!cityId) throw new ValidationError("cityId is required.");
    const data = await getHomeCatalogue(cityId);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
