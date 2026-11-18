import { neon } from "@neondatabase/serverless";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export type NextStitchStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "contacted"
  | "selected"
  | "archived";

export type SubmissionType = "nomination" | "self";

export interface NextStitchStory {
  id: number;
  referenceCode: string;
  submissionType: SubmissionType;
  nomineeName: string;
  nomineeAge: string;
  nomineeLocation: string;
  educationStage: string;
  learningSetup: string;
  nomineePhone: string;
  nominatorName: string;
  relationship: string;
  contactPhone: string;
  contactEmail: string;
  story: string;
  additionalDetails: string;
  status: NextStitchStatus;
  isStarred: boolean;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNextStitchInput {
  submissionType: SubmissionType;
  nomineeName: string;
  nomineeAge?: string;
  nomineeLocation: string;
  educationStage: string;
  learningSetup?: string;
  nomineePhone?: string;
  nominatorName: string;
  relationship: string;
  contactPhone: string;
  contactEmail?: string;
  story: string;
  additionalDetails?: string;
}

export interface UpdateNextStitchPatch {
  status?: NextStitchStatus;
  isStarred?: boolean;
  adminNotes?: string;
}

let schemaInitialized = false;
let schemaInitPromise: Promise<void> | null = null;

function getDatabaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url ? url : null;
}

export function getStorageMode(): "neon" | "local-dev-file" {
  const url = getDatabaseUrl();
  if (url) return "neon";
  if (process.env.VERCEL === "1") {
    throw new Error(
      "DATABASE_URL is missing in Vercel environment variables. Connect your Neon Postgres database and redeploy."
    );
  }
  return "local-dev-file";
}

function getSqlClient() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(url);
}

async function ensureSchema() {
  if (schemaInitialized) return;
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      const sql = getSqlClient();
      await sql`
        CREATE TABLE IF NOT EXISTS next_stitch_stories (
          id SERIAL PRIMARY KEY,
          reference_code TEXT NOT NULL UNIQUE,
          submission_type TEXT NOT NULL,
          nominee_name TEXT NOT NULL,
          nominee_age TEXT DEFAULT '',
          nominee_location TEXT NOT NULL,
          education_stage TEXT NOT NULL,
          learning_setup TEXT DEFAULT '',
          nominee_phone TEXT DEFAULT '',
          nominator_name TEXT NOT NULL,
          relationship TEXT NOT NULL,
          contact_phone TEXT NOT NULL,
          contact_email TEXT DEFAULT '',
          story TEXT NOT NULL,
          additional_details TEXT DEFAULT '',
          status TEXT NOT NULL DEFAULT 'new',
          is_starred BOOLEAN NOT NULL DEFAULT FALSE,
          admin_notes TEXT DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_next_stitch_created_at
        ON next_stitch_stories (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_next_stitch_status
        ON next_stitch_stories (status)
      `;
      schemaInitialized = true;
    })().catch((err) => {
      schemaInitPromise = null;
      throw err;
    });
  }
  await schemaInitPromise;
}

function generateReferenceCode(): string {
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `NSI-${token}`;
}

function mapRow(row: Record<string, unknown>): NextStitchStory {
  return {
    id: Number(row.id),
    referenceCode: String(row.reference_code ?? ""),
    submissionType:
      row.submission_type === "self" ? "self" : "nomination",
    nomineeName: String(row.nominee_name ?? ""),
    nomineeAge: String(row.nominee_age ?? ""),
    nomineeLocation: String(row.nominee_location ?? ""),
    educationStage: String(row.education_stage ?? ""),
    learningSetup: String(row.learning_setup ?? ""),
    nomineePhone: String(row.nominee_phone ?? ""),
    nominatorName: String(row.nominator_name ?? ""),
    relationship: String(row.relationship ?? ""),
    contactPhone: String(row.contact_phone ?? ""),
    contactEmail: String(row.contact_email ?? ""),
    story: String(row.story ?? ""),
    additionalDetails: String(row.additional_details ?? ""),
    status: (String(row.status ?? "new") as NextStitchStatus) || "new",
    isStarred: Boolean(row.is_starred),
    adminNotes: String(row.admin_notes ?? ""),
    createdAt: new Date(String(row.created_at ?? new Date())).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? new Date())).toISOString(),
  };
}

// Local development JSON persistence (only used outside Vercel when DATABASE_URL is unset)
const LOCAL_DB_PATH = path.join(
  process.cwd(),
  ".data",
  "next-stitch-dev.json"
);

async function readLocalStore(): Promise<NextStitchStory[]> {
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalStore(items: NextStitchStory[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function createNextStitchStory(
  input: CreateNextStitchInput
): Promise<NextStitchStory> {
  const mode = getStorageMode();
  const referenceCode = generateReferenceCode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      INSERT INTO next_stitch_stories (
        reference_code,
        submission_type,
        nominee_name,
        nominee_age,
        nominee_location,
        education_stage,
        learning_setup,
        nominee_phone,
        nominator_name,
        relationship,
        contact_phone,
        contact_email,
        story,
        additional_details
      ) VALUES (
        ${referenceCode},
        ${input.submissionType},
        ${input.nomineeName},
        ${input.nomineeAge ?? ""},
        ${input.nomineeLocation},
        ${input.educationStage},
        ${input.learningSetup ?? ""},
        ${input.nomineePhone ?? ""},
        ${input.nominatorName},
        ${input.relationship},
        ${input.contactPhone},
        ${input.contactEmail ?? ""},
        ${input.story},
        ${input.additionalDetails ?? ""}
      )
      RETURNING *
    `;
    return mapRow(rows[0] as Record<string, unknown>);
  }

  const items = await readLocalStore();
  const now = new Date().toISOString();
  const nextId =
    items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const created: NextStitchStory = {
    id: nextId,
    referenceCode,
    submissionType: input.submissionType,
    nomineeName: input.nomineeName,
    nomineeAge: input.nomineeAge ?? "",
    nomineeLocation: input.nomineeLocation,
    educationStage: input.educationStage,
    learningSetup: input.learningSetup ?? "",
    nomineePhone: input.nomineePhone ?? "",
    nominatorName: input.nominatorName,
    relationship: input.relationship,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail ?? "",
    story: input.story,
    additionalDetails: input.additionalDetails ?? "",
    status: "new",
    isStarred: false,
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(created);
  await writeLocalStore(items);
  return created;
}

export async function listNextStitchStories(): Promise<NextStitchStory[]> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      SELECT *
      FROM next_stitch_stories
      ORDER BY created_at DESC
    `;
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  }

  const items = await readLocalStore();
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateNextStitchStory(
  id: number,
  patch: UpdateNextStitchPatch
): Promise<NextStitchStory | null> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const existingRows = await sql`
      SELECT * FROM next_stitch_stories WHERE id = ${id} LIMIT 1
    `;
    if (existingRows.length === 0) return null;

    const current = mapRow(existingRows[0] as Record<string, unknown>);
    const nextStatus = patch.status ?? current.status;
    const nextStarred =
      typeof patch.isStarred === "boolean"
        ? patch.isStarred
        : current.isStarred;
    const nextNotes =
      typeof patch.adminNotes === "string"
        ? patch.adminNotes
        : current.adminNotes;

    const updatedRows = await sql`
      UPDATE next_stitch_stories
      SET
        status = ${nextStatus},
        is_starred = ${nextStarred},
        admin_notes = ${nextNotes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return mapRow(updatedRows[0] as Record<string, unknown>);
  }

  const items = await readLocalStore();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = items[idx];
  const updated: NextStitchStory = {
    ...current,
    status: patch.status ?? current.status,
    isStarred:
      typeof patch.isStarred === "boolean"
        ? patch.isStarred
        : current.isStarred,
    adminNotes:
      typeof patch.adminNotes === "string"
        ? patch.adminNotes
        : current.adminNotes,
    updatedAt: new Date().toISOString(),
  };
  items[idx] = updated;
  await writeLocalStore(items);
  return updated;
}
