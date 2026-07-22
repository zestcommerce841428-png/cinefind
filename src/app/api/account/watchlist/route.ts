import { NextResponse } from "next/server";
import { getAccountDetails, addToWatchlist } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import { watchlistBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  const { data, error } = await parseJsonBody(request, watchlistBodySchema);
  if (error) return error;

  const account = await getAccountDetails(sessionId);
  const result = await addToWatchlist(account.id, sessionId, data.mediaType, data.mediaId, data.watchlist);
  return NextResponse.json(result);
}
