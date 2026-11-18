import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  getStorageMode,
  listNextStitchStories,
  updateNextStitchStory,
  type NextStitchStatus,
} from "@/lib/db";

const VALID_STATUSES: NextStitchStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "contacted",
  "selected",
  "archived",
];

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stories = await listNextStitchStories();
    return NextResponse.json({
      stories,
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
      return NextResponse.json({ error: "Invalid story ID." }, { status: 400 });
    }

    const patch: {
      status?: NextStitchStatus;
      isStarred?: boolean;
      adminNotes?: string;
    } = {};

    if (typeof body?.status === "string") {
      if (!VALID_STATUSES.includes(body.status as NextStitchStatus)) {
        return NextResponse.json(
          { error: "Invalid status value." },
          { status: 400 }
        );
      }
      patch.status = body.status as NextStitchStatus;
    }

    if (typeof body?.isStarred === "boolean") {
      patch.isStarred = body.isStarred;
    }

    if (typeof body?.adminNotes === "string") {
      patch.adminNotes = body.adminNotes.slice(0, 3000);
    }

    const updated = await updateNextStitchStory(id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ story: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update story.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
