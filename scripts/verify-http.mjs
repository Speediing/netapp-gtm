import assert from "node:assert/strict";

const baseUrl = process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000";
const password = process.env.SITE_PASSWORD?.trim();

assert(password, "SITE_PASSWORD is required for the HTTP check.");

function url(path) {
  return new URL(path, baseUrl);
}

async function request(path, init = {}) {
  return fetch(url(path), { redirect: "manual", ...init });
}

const redirect = await request("/");
assert(
  redirect.status === 307 || redirect.status === 308,
  `Expected a protected redirect, received ${redirect.status}.`,
);
assert.equal(redirect.headers.get("location"), "/login?next=%2F");

const mediaDenied = await request("/api/media/check.mp4");
assert.equal(mediaDenied.status, 401);

const wrong = await request("/api/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ password: `${password}-wrong`, next: "/" }),
});
assert.equal(wrong.status, 401);

const login = await request("/api/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ password, next: "//outside.example" }),
});
assert.equal(login.status, 200);

const payload = await login.json();
assert.equal(payload.next, "/");

const setCookie = login.headers.get("set-cookie");
assert(setCookie, "Login did not set an access cookie.");
assert.match(setCookie, /^netapp_gtm_session=/);
assert.match(setCookie, /HttpOnly/i);
assert.match(setCookie, /SameSite=Lax/i);
assert.match(setCookie, /Path=\//i);
assert(!setCookie.includes(password), "Access cookie contains the password.");

const cookie = setCookie.split(";")[0];
const protectedPage = await request("/", {
  headers: { cookie },
});
assert.equal(protectedPage.status, 200);

const html = await protectedPage.text();
for (const expected of [
  "NetApp x SpaceXAI",
  "Sean Middleton",
  "agent-fleet",
  "netapp-watercolor-header.jpg",
]) {
  assert(html.includes(expected), `Protected page is missing ${expected}.`);
}

const missingMedia = await request("/api/media/check.mp4", {
  headers: { cookie },
});
assert.equal(missingMedia.status, 404);

const logout = await request("/api/logout", {
  method: "POST",
  headers: { cookie },
});
assert.equal(logout.status, 200);
assert.match(logout.headers.get("set-cookie") || "", /Max-Age=0/i);

console.log("Password and protected media HTTP checks passed.");
