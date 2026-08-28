import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  passwordMatches,
  sessionToken,
  sitePassword,
} from "@/lib/auth";

function safeNext(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const configuredPassword = sitePassword();

  if (!configuredPassword) {
    if (contentType.includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Site access is not configured." },
        { status: 503 },
      );
    }
    return NextResponse.redirect(new URL("/login?config=1", request.url), {
      status: 303,
    });
  }

  let password = "";
  let next = "/";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string; next?: string };
    password = body.password || "";
    next = safeNext(body.next);
  } else {
    const form = await request.formData();
    password = String(form.get("password") || "");
    next = safeNext(String(form.get("next") || "/"));
  }

  if (!passwordMatches(password, configuredPassword)) {
    if (contentType.includes("application/json")) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const err = new URL("/login", request.url);
    err.searchParams.set("error", "1");
    if (next !== "/") err.searchParams.set("next", next);
    return NextResponse.redirect(err, { status: 303 });
  }

  const response = contentType.includes("application/json")
    ? NextResponse.json({ ok: true, next })
    : NextResponse.redirect(new URL(next, request.url), { status: 303 });

  response.cookies.set(AUTH_COOKIE, await sessionToken(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
