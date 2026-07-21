import { NextResponse } from "next/server";
import { addItemToList, removeItemFromList } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { mediaId } = await request.json();
  const result = await addItemToList(id, sessionId, mediaId);
  return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { mediaId } = await request.json();
  const result = await removeItemFromList(id, sessionId, mediaId);
  return NextResponse.json(result);
}
