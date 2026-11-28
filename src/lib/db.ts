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

export type HybridApplicationStatus =
  | "new"
  | "reviewing"
  | "approved"
  | "registered"
  | "archived";

export interface HybridApplication {
  id: number;
  referenceCode: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  residentialAddress: string;
  occupation: string;
  trainingLevel: string;
  programId: string;
  experienceLevel: string;
  whyHybrid: string;
  availableDays: string;
  machineAccess: string;
  internetAccess: string;
  agreedConditions: boolean;
  signatureName: string;
  applicationDate: string;
  status: HybridApplicationStatus;
  isStarred: boolean;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHybridApplicationInput {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  residentialAddress: string;
  occupation: string;
  trainingLevel: string;
  programId: string;
  experienceLevel: string;
  whyHybrid: string;
  availableDays: string;
  machineAccess: string;
  internetAccess: string;
  agreedConditions: boolean;
  signatureName: string;
  applicationDate: string;
}

export interface UpdateHybridApplicationPatch {
  status?: HybridApplicationStatus;
  isStarred?: boolean;
  adminNotes?: string;
}

export type HangoutTicketType = "physical" | "online";

export type HangoutRegistrationStatus =
  | "pending_payment"
  | "paid"
  | "checked_in"
  | "archived";

export interface HangoutRegistration {
  id: number;
  ticketCode: string;
  paystackReference: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  city: string;
  fashionRole: string;
  questionNote: string;
  ticketType: HangoutTicketType;
  amountNaira: number;
  channel: string;
  paidAt: string;
  status: HangoutRegistrationStatus;
  isStarred: boolean;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHangoutRegistrationInput {
  paystackReference: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  city: string;
  fashionRole: string;
  questionNote: string;
  ticketType: HangoutTicketType;
  amountNaira: number;
  channel: string;
  paidAt: string;
}

export interface UpdateHangoutRegistrationPatch {
  status?: HangoutRegistrationStatus;
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
      await sql`
        CREATE TABLE IF NOT EXISTS hybrid_applications (
          id SERIAL PRIMARY KEY,
          reference_code TEXT NOT NULL UNIQUE,
          full_name TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          whatsapp_number TEXT NOT NULL,
          email_address TEXT NOT NULL,
          residential_address TEXT NOT NULL,
          occupation TEXT NOT NULL,
          training_level TEXT NOT NULL,
          program_id TEXT NOT NULL,
          experience_level TEXT NOT NULL,
          why_hybrid TEXT NOT NULL,
          available_days TEXT NOT NULL,
          machine_access TEXT NOT NULL,
          internet_access TEXT NOT NULL,
          agreed_conditions BOOLEAN NOT NULL DEFAULT TRUE,
          signature_name TEXT NOT NULL,
          application_date TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new',
          is_starred BOOLEAN NOT NULL DEFAULT FALSE,
          admin_notes TEXT DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_hybrid_apps_created_at
        ON hybrid_applications (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_hybrid_apps_status
        ON hybrid_applications (status)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS hangout_registrations (
          id SERIAL PRIMARY KEY,
          ticket_code TEXT NOT NULL UNIQUE,
          paystack_reference TEXT NOT NULL UNIQUE,
          full_name TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          whatsapp_number TEXT NOT NULL,
          email_address TEXT DEFAULT '',
          city TEXT DEFAULT '',
          fashion_role TEXT DEFAULT '',
          question_note TEXT DEFAULT '',
          ticket_type TEXT NOT NULL,
          amount_naira INTEGER NOT NULL,
          channel TEXT DEFAULT 'paystack',
          paid_at TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'paid',
          is_starred BOOLEAN NOT NULL DEFAULT FALSE,
          admin_notes TEXT DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_hangout_created_at
        ON hangout_registrations (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_hangout_ticket_type
        ON hangout_registrations (ticket_type)
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

// ============================================================
// Hybrid Training Application Helpers
// ============================================================

function generateHybridReferenceCode(): string {
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `JHF-HYB-${token}`;
}

function mapHybridRow(row: Record<string, unknown>): HybridApplication {
  return {
    id: Number(row.id),
    referenceCode: String(row.reference_code ?? ""),
    fullName: String(row.full_name ?? ""),
    phoneNumber: String(row.phone_number ?? ""),
    whatsappNumber: String(row.whatsapp_number ?? ""),
    emailAddress: String(row.email_address ?? ""),
    residentialAddress: String(row.residential_address ?? ""),
    occupation: String(row.occupation ?? ""),
    trainingLevel: String(row.training_level ?? ""),
    programId: String(row.program_id ?? "foundational"),
    experienceLevel: String(row.experience_level ?? ""),
    whyHybrid: String(row.why_hybrid ?? ""),
    availableDays: String(row.available_days ?? ""),
    machineAccess: String(row.machine_access ?? ""),
    internetAccess: String(row.internet_access ?? ""),
    agreedConditions: Boolean(row.agreed_conditions),
    signatureName: String(row.signature_name ?? ""),
    applicationDate: String(row.application_date ?? ""),
    status: (String(row.status ?? "new") as HybridApplicationStatus) || "new",
    isStarred: Boolean(row.is_starred),
    adminNotes: String(row.admin_notes ?? ""),
    createdAt: new Date(String(row.created_at ?? new Date())).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? new Date())).toISOString(),
  };
}

const LOCAL_HYBRID_DB_PATH = path.join(
  process.cwd(),
  ".data",
  "hybrid-applications-dev.json"
);

async function readLocalHybridStore(): Promise<HybridApplication[]> {
  try {
    const raw = await fs.readFile(LOCAL_HYBRID_DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalHybridStore(
  items: HybridApplication[]
): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_HYBRID_DB_PATH), { recursive: true });
  await fs.writeFile(
    LOCAL_HYBRID_DB_PATH,
    JSON.stringify(items, null, 2),
    "utf8"
  );
}

export async function createHybridApplication(
  input: CreateHybridApplicationInput
): Promise<HybridApplication> {
  const mode = getStorageMode();
  const referenceCode = generateHybridReferenceCode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      INSERT INTO hybrid_applications (
        reference_code,
        full_name,
        phone_number,
        whatsapp_number,
        email_address,
        residential_address,
        occupation,
        training_level,
        program_id,
        experience_level,
        why_hybrid,
        available_days,
        machine_access,
        internet_access,
        agreed_conditions,
        signature_name,
        application_date
      ) VALUES (
        ${referenceCode},
        ${input.fullName},
        ${input.phoneNumber},
        ${input.whatsappNumber},
        ${input.emailAddress},
        ${input.residentialAddress},
        ${input.occupation},
        ${input.trainingLevel},
        ${input.programId},
        ${input.experienceLevel},
        ${input.whyHybrid},
        ${input.availableDays},
        ${input.machineAccess},
        ${input.internetAccess},
        ${input.agreedConditions},
        ${input.signatureName},
        ${input.applicationDate}
      )
      RETURNING *
    `;
    return mapHybridRow(rows[0] as Record<string, unknown>);
  }

  const items = await readLocalHybridStore();
  const now = new Date().toISOString();
  const nextId =
    items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const created: HybridApplication = {
    id: nextId,
    referenceCode,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    whatsappNumber: input.whatsappNumber,
    emailAddress: input.emailAddress,
    residentialAddress: input.residentialAddress,
    occupation: input.occupation,
    trainingLevel: input.trainingLevel,
    programId: input.programId,
    experienceLevel: input.experienceLevel,
    whyHybrid: input.whyHybrid,
    availableDays: input.availableDays,
    machineAccess: input.machineAccess,
    internetAccess: input.internetAccess,
    agreedConditions: input.agreedConditions,
    signatureName: input.signatureName,
    applicationDate: input.applicationDate,
    status: "new",
    isStarred: false,
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(created);
  await writeLocalHybridStore(items);
  return created;
}

export async function listHybridApplications(): Promise<HybridApplication[]> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      SELECT *
      FROM hybrid_applications
      ORDER BY created_at DESC
    `;
    return rows.map((row) => mapHybridRow(row as Record<string, unknown>));
  }

  const items = await readLocalHybridStore();
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateHybridApplication(
  id: number,
  patch: UpdateHybridApplicationPatch
): Promise<HybridApplication | null> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const existingRows = await sql`
      SELECT * FROM hybrid_applications WHERE id = ${id} LIMIT 1
    `;
    if (existingRows.length === 0) return null;

    const current = mapHybridRow(existingRows[0] as Record<string, unknown>);
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
      UPDATE hybrid_applications
      SET
        status = ${nextStatus},
        is_starred = ${nextStarred},
        admin_notes = ${nextNotes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return mapHybridRow(updatedRows[0] as Record<string, unknown>);
  }

  const items = await readLocalHybridStore();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = items[idx];
  const updated: HybridApplication = {
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
  await writeLocalHybridStore(items);
  return updated;
}

// ============================================================
// JHF Hangout 2027 Registration Helpers
// ============================================================

function generateHangoutTicketCode(): string {
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `JHF-H27-${token}`;
}

function mapHangoutRow(row: Record<string, unknown>): HangoutRegistration {
  return {
    id: Number(row.id),
    ticketCode: String(row.ticket_code ?? ""),
    paystackReference: String(row.paystack_reference ?? ""),
    fullName: String(row.full_name ?? ""),
    phoneNumber: String(row.phone_number ?? ""),
    whatsappNumber: String(row.whatsapp_number ?? ""),
    emailAddress: String(row.email_address ?? ""),
    city: String(row.city ?? ""),
    fashionRole: String(row.fashion_role ?? ""),
    questionNote: String(row.question_note ?? ""),
    ticketType: row.ticket_type === "online" ? "online" : "physical",
    amountNaira: Number(row.amount_naira ?? 0),
    channel: String(row.channel ?? "paystack"),
    paidAt: String(row.paid_at ?? new Date().toISOString()),
    status: (String(row.status ?? "paid") as HangoutRegistrationStatus) || "paid",
    isStarred: Boolean(row.is_starred),
    adminNotes: String(row.admin_notes ?? ""),
    createdAt: new Date(String(row.created_at ?? new Date())).toISOString(),
    updatedAt: new Date(String(row.updated_at ?? new Date())).toISOString(),
  };
}

const LOCAL_HANGOUT_DB_PATH = path.join(
  process.cwd(),
  ".data",
  "hangout-2027-dev.json"
);

async function readLocalHangoutStore(): Promise<HangoutRegistration[]> {
  try {
    const raw = await fs.readFile(LOCAL_HANGOUT_DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalHangoutStore(
  items: HangoutRegistration[]
): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_HANGOUT_DB_PATH), { recursive: true });
  await fs.writeFile(
    LOCAL_HANGOUT_DB_PATH,
    JSON.stringify(items, null, 2),
    "utf8"
  );
}

export async function createHangoutProspectLead(
  input: CreateHangoutRegistrationInput
): Promise<HangoutRegistration> {
  const mode = getStorageMode();
  const ticketCode = generateHangoutTicketCode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      INSERT INTO hangout_registrations (
        ticket_code,
        paystack_reference,
        full_name,
        phone_number,
        whatsapp_number,
        email_address,
        city,
        fashion_role,
        question_note,
        ticket_type,
        amount_naira,
        channel,
        paid_at,
        status
      ) VALUES (
        ${ticketCode},
        ${input.paystackReference},
        ${input.fullName},
        ${input.phoneNumber},
        ${input.whatsappNumber},
        ${input.emailAddress},
        ${input.city},
        ${input.fashionRole},
        ${input.questionNote},
        ${input.ticketType},
        ${input.amountNaira},
        ${input.channel},
        ${input.paidAt},
        'pending_payment'
      )
      ON CONFLICT (paystack_reference) DO UPDATE
      SET
        full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        whatsapp_number = EXCLUDED.whatsapp_number,
        email_address = EXCLUDED.email_address,
        city = EXCLUDED.city,
        fashion_role = EXCLUDED.fashion_role,
        question_note = EXCLUDED.question_note,
        ticket_type = EXCLUDED.ticket_type,
        amount_naira = EXCLUDED.amount_naira,
        updated_at = NOW()
      RETURNING *
    `;
    return mapHangoutRow(rows[0] as Record<string, unknown>);
  }

  const items = await readLocalHangoutStore();
  const existingIdx = items.findIndex(
    (item) => item.paystackReference === input.paystackReference
  );
  if (existingIdx !== -1) {
    return items[existingIdx];
  }

  const now = new Date().toISOString();
  const nextId =
    items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const created: HangoutRegistration = {
    id: nextId,
    ticketCode,
    paystackReference: input.paystackReference,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    whatsappNumber: input.whatsappNumber,
    emailAddress: input.emailAddress,
    city: input.city,
    fashionRole: input.fashionRole,
    questionNote: input.questionNote,
    ticketType: input.ticketType,
    amountNaira: input.amountNaira,
    channel: input.channel,
    paidAt: input.paidAt,
    status: "pending_payment",
    isStarred: false,
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(created);
  await writeLocalHangoutStore(items);
  return created;
}

export async function upsertHangoutRegistration(
  input: CreateHangoutRegistrationInput
): Promise<HangoutRegistration> {
  const mode = getStorageMode();
  const ticketCode = generateHangoutTicketCode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      INSERT INTO hangout_registrations (
        ticket_code,
        paystack_reference,
        full_name,
        phone_number,
        whatsapp_number,
        email_address,
        city,
        fashion_role,
        question_note,
        ticket_type,
        amount_naira,
        channel,
        paid_at,
        status
      ) VALUES (
        ${ticketCode},
        ${input.paystackReference},
        ${input.fullName},
        ${input.phoneNumber},
        ${input.whatsappNumber},
        ${input.emailAddress},
        ${input.city},
        ${input.fashionRole},
        ${input.questionNote},
        ${input.ticketType},
        ${input.amountNaira},
        ${input.channel},
        ${input.paidAt},
        'paid'
      )
      ON CONFLICT (paystack_reference) DO UPDATE
      SET
        status = CASE
          WHEN hangout_registrations.status = 'pending_payment' THEN 'paid'
          ELSE hangout_registrations.status
        END,
        amount_naira = EXCLUDED.amount_naira,
        channel = EXCLUDED.channel,
        paid_at = EXCLUDED.paid_at,
        updated_at = NOW()
      RETURNING *
    `;
    return mapHangoutRow(rows[0] as Record<string, unknown>);
  }

  const items = await readLocalHangoutStore();
  const existingIdx = items.findIndex(
    (item) => item.paystackReference === input.paystackReference
  );
  if (existingIdx !== -1) {
    const existing = items[existingIdx];
    const upgraded: HangoutRegistration = {
      ...existing,
      status: existing.status === "pending_payment" ? "paid" : existing.status,
      amountNaira: input.amountNaira,
      channel: input.channel,
      paidAt: input.paidAt,
      updatedAt: new Date().toISOString(),
    };
    items[existingIdx] = upgraded;
    await writeLocalHangoutStore(items);
    return upgraded;
  }

  const now = new Date().toISOString();
  const nextId =
    items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const created: HangoutRegistration = {
    id: nextId,
    ticketCode,
    paystackReference: input.paystackReference,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    whatsappNumber: input.whatsappNumber,
    emailAddress: input.emailAddress,
    city: input.city,
    fashionRole: input.fashionRole,
    questionNote: input.questionNote,
    ticketType: input.ticketType,
    amountNaira: input.amountNaira,
    channel: input.channel,
    paidAt: input.paidAt,
    status: "paid",
    isStarred: false,
    adminNotes: "",
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(created);
  await writeLocalHangoutStore(items);
  return created;
}

export async function listHangoutRegistrations(): Promise<
  HangoutRegistration[]
> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const rows = await sql`
      SELECT *
      FROM hangout_registrations
      ORDER BY created_at DESC
    `;
    return rows.map((row) => mapHangoutRow(row as Record<string, unknown>));
  }

  const items = await readLocalHangoutStore();
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function updateHangoutRegistration(
  id: number,
  patch: UpdateHangoutRegistrationPatch
): Promise<HangoutRegistration | null> {
  const mode = getStorageMode();

  if (mode === "neon") {
    await ensureSchema();
    const sql = getSqlClient();
    const existingRows = await sql`
      SELECT * FROM hangout_registrations WHERE id = ${id} LIMIT 1
    `;
    if (existingRows.length === 0) return null;

    const current = mapHangoutRow(existingRows[0] as Record<string, unknown>);
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
      UPDATE hangout_registrations
      SET
        status = ${nextStatus},
        is_starred = ${nextStarred},
        admin_notes = ${nextNotes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return mapHangoutRow(updatedRows[0] as Record<string, unknown>);
  }

  const items = await readLocalHangoutStore();
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = items[idx];
  const updated: HangoutRegistration = {
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
  await writeLocalHangoutStore(items);
  return updated;
}
