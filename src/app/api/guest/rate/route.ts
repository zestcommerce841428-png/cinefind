import { NextResponse } from "next/server";
import { createGuestSession, rateMediaAsGuest } from "@/lib/tmdb";
import { getGuestSessionId, setGuestSessionCookie } from "@/lib/session";
import { rateBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request) {
  const { data, error } = await parseJsonBody(request, rateBodySchema);
  if (error) return error;

  let guestSessionId = await getGuestSessionId();
  if (!guestSessionId) {
    const guest = await createGuestSession();
    guestSessionId = guest.guest_session_id;
    await setGuestSessionCookie(guestSessionId);
  }

  const result = await rateMediaAsGuest(data.mediaType, data.mediaId, guestSessionId, data.value);
  return NextResponse.json(result);
}
