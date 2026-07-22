import { NextResponse } from "next/server";
import { getAccountDetails, markAsFavorite } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import { favoriteBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { data, error } = await parseJsonBody(request, favoriteBodySchema);
  if (error) return error;

  const account = await getAccountDetails(sessionId);
  const result = await markAsFavorite(account.id, sessionId, data.mediaType, data.mediaId, data.favorite);
  return NextResponse.json(result);
}
