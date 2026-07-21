import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/tmdb";
import { getSessionId, clearSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (sessionId) {
    await deleteSession(sessionId).catch(() => undefined);
  }
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/", request.url));
}
