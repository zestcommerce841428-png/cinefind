import { NextResponse } from "next/server";
import { rateMedia, deleteRating } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { mediaType, mediaId, value } = await request.json();
  const result = await rateMedia(mediaType, mediaId, sessionId, value);
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { mediaType, mediaId } = await request.json();
  const result = await deleteRating(mediaType, mediaId, sessionId);
  return NextResponse.json(result);
}
