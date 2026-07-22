import { NextResponse } from "next/server";
import { addItemToList, removeItemFromList } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import { listItemBodySchema, parseJsonBody } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { data, error } = await parseJsonBody(request, listItemBodySchema);
  if (error) return error;

  const result = await addItemToList(id, sessionId, data.mediaId);
  return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { data, error } = await parseJsonBody(request, listItemBodySchema);
  if (error) return error;

  const result = await removeItemFromList(id, sessionId, data.mediaId);
  return NextResponse.json(result);
}
