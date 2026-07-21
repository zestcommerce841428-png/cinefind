import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>CineFind</ShortName>
  <Description>Search movies, TV shows, and people on CineFind</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image height="32" width="32" type="image/svg+xml">${SITE_URL}/icon.svg</Image>
  <Url type="text/html" method="get" template="${SITE_URL}/search?q={searchTerms}" />
</OpenSearchDescription>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/opensearchdescription+xml" },
  });
}
