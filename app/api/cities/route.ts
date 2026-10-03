import { NextResponse } from "next/server";
import { listCities } from "@/lib/services/catalogue";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cities = await listCities();
    return NextResponse.json({ cities });
  } catch (err) {
    return handleApiError(err);
  }
}
