import { NextResponse } from "next/server";
import { createSession } from "@/lib/tmdb";
import { setSessionCookie } from "@/lib/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestToken = url.searchParams.get("request_token");
  const approved = url.searchParams.get("denied") !== "true";

  if (!requestToken || !approved) {
    return NextResponse.redirect(new URL("/?auth=denied", url.origin));
  }

  try {
    const { session_id } = await createSession(requestToken);
    await setSessionCookie(session_id);
    return NextResponse.redirect(new URL("/account", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/?auth=error", url.origin));
  }
}
