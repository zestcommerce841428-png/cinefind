import { NextResponse } from "next/server";
import { createList } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import { createListBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { data, error } = await parseJsonBody(request, createListBodySchema);
  if (error) return error;

  const result = await createList(sessionId, data.name, data.description);
  return NextResponse.json(result);
}
