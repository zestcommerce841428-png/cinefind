import { NextResponse } from "next/server";
import { createGuestSession, rateMediaAsGuest } from "@/lib/tmdb";
import { getGuestSessionId, setGuestSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { mediaType, mediaId, value } = await request.json();

  let guestSessionId = await getGuestSessionId();
  if (!guestSessionId) {
    const guest = await createGuestSession();
    guestSessionId = guest.guest_session_id;
    await setGuestSessionCookie(guestSessionId);
  }

  const result = await rateMediaAsGuest(mediaType, mediaId, guestSessionId, value);
  return NextResponse.json(result);
}
