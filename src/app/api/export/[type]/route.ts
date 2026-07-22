import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { EXPORT_TYPES, fetchExportRows, toCsv, type ExportType } from "@/lib/exportAccountData";

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!EXPORT_TYPES.includes(type as ExportType)) {
    return NextResponse.json({ error: "Unknown export type" }, { status: 404 });
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "json";
  const rows = await fetchExportRows(type as ExportType, sessionId);

  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cinefind-${type}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(rows, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cinefind-${type}.json"`,
    },
  });
}
