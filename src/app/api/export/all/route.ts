import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { EXPORT_TYPES, fetchExportRows } from "@/lib/exportAccountData";

export async function GET() {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const entries = await Promise.all(
    EXPORT_TYPES.map(async (type) => [type, await fetchExportRows(type, sessionId)] as const)
  );

  const bundle = {
    exportedAt: new Date().toISOString(),
    ...Object.fromEntries(entries),
  };

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cinefind-full-backup.json"',
    },
  });
}
