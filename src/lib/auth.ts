const encoder = new TextEncoder();

export const AUTH_COOKIE = "first_read_auth";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function readEnv(): { password: string; secret: string } {
  const password = process.env.APP_PASSWORD;
  const secret = process.env.APP_SECRET;
  if (!password || !secret) {
    throw new Error(
      "APP_PASSWORD and APP_SECRET must both be set as environment variables",
    );
  }
  return { password, secret };
}

let cachedToken: string | null = null;

export async function expectedAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const { password, secret } = readEnv();
  cachedToken = await hmacSha256Hex(password, secret);
  return cachedToken;
}

export async function isAuthenticated(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  try {
    const expected = await expectedAuthToken();
    return timingSafeEqual(cookieValue, expected);
  } catch {
    return false;
  }
}

export function verifyPassword(submitted: string): boolean {
  const { password } = readEnv();
  return timingSafeEqual(submitted, password);
}
