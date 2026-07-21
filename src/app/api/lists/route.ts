import { NextResponse } from "next/server";
import { createList } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { name, description } = await request.json();
  const result = await createList(sessionId, name, description);
  return NextResponse.json(result);
}
