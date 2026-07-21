import { NextResponse } from "next/server";
import { deleteList } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const result = await deleteList(id, sessionId);
  return NextResponse.json(result);
}
