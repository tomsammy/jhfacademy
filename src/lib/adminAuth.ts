import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "jhf_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getConfiguredPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  return pw ? pw : null;
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(getConfiguredPassword());
}

function getSigningKey(): string {
  const base =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    getConfiguredPassword() ||
    "unconfigured";
  return crypto
    .createHash("sha256")
    .update(`jhf-admin-hmac-key::${base}`)
    .digest("hex");
}

function constantTimeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = getConfiguredPassword();
  if (!expected) return false;
  return constantTimeCompare(candidate.trim(), expected);
}

export function createAdminSessionToken(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  const signature = crypto
    .createHmac("sha256", getSigningKey())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !isAdminPasswordConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expStr, nonce, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const payload = `${expStr}.${nonce}`;
  const expectedSig = crypto
    .createHmac("sha256", getSigningKey())
    .update(payload)
    .digest("hex");
  if (sig.length !== expectedSig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
