import { NextResponse } from "next/server";
import { listAllUsers } from "@/lib/services/admin";
import { requireRole } from "@/lib/session";
import { handleApiError } from "@/lib/api-errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("ADMIN");
    const users = await listAllUsers();
    return NextResponse.json({ users });
  } catch (err) {
    return handleApiError(err);
  }
}
