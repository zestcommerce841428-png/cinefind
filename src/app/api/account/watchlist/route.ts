import { NextResponse } from "next/server";
import { getAccountDetails, addToWatchlist } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { mediaType, mediaId, watchlist } = await request.json();
  const account = await getAccountDetails(sessionId);
  const result = await addToWatchlist(account.id, sessionId, mediaType, mediaId, watchlist);
  return NextResponse.json(result);
}
