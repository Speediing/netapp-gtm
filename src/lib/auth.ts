export const AUTH_COOKIE = "netapp_gtm_session";

export function sitePassword(): string | null {
  const password = process.env.SITE_PASSWORD?.trim();
  return password || null;
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function sessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`netapp-gtm:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export async function isValidSession(
  token: string | undefined | null,
): Promise<boolean> {
  const password = sitePassword();
  if (!token || !password) return false;

  const expected = await sessionToken(password);
  if (token.length !== expected.length) return false;

  let mismatch = 0;
  for (let index = 0; index < token.length; index += 1) {
    mismatch |= token.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export function passwordMatches(input: string, expected: string): boolean {
  if (input.length !== expected.length) return false;

  let mismatch = 0;
  for (let index = 0; index < input.length; index += 1) {
    mismatch |= input.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}
