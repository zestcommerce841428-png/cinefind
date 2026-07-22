import { NextResponse } from "next/server";
import { rateMedia, deleteRating } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import { rateBodySchema, deleteRatingBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { data, error } = await parseJsonBody(request, rateBodySchema);
  if (error) return error;

  const result = await rateMedia(data.mediaType, data.mediaId, sessionId, data.value);
  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { data, error } = await parseJsonBody(request, deleteRatingBodySchema);
  if (error) return error;

  const result = await deleteRating(data.mediaType, data.mediaId, sessionId);
  return NextResponse.json(result);
}
