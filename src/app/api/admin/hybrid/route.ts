import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  getStorageMode,
  listHybridApplications,
  updateHybridApplication,
  type HybridApplicationStatus,
} from "@/lib/db";

const VALID_STATUSES: HybridApplicationStatus[] = [
  "new",
  "reviewing",
  "approved",
  "registered",
  "archived",
];

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const applications = await listHybridApplications();
    return NextResponse.json({
      applications,
      storageMode: getStorageMode(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database query failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid application ID." },
        { status: 400 }
      );
    }

    const patch: {
      status?: HybridApplicationStatus;
      isStarred?: boolean;
      adminNotes?: string;
    } = {};

    if (typeof body?.status === "string") {
      if (!VALID_STATUSES.includes(body.status as HybridApplicationStatus)) {
        return NextResponse.json(
          { error: "Invalid status value." },
          { status: 400 }
        );
      }
      patch.status = body.status as HybridApplicationStatus;
    }

    if (typeof body?.isStarred === "boolean") {
      patch.isStarred = body.isStarred;
    }

    if (typeof body?.adminNotes === "string") {
      patch.adminNotes = body.adminNotes.slice(0, 3000);
    }

    const updated = await updateHybridApplication(id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: "Hybrid application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update Hybrid application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
