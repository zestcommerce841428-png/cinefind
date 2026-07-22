import { NextResponse } from "next/server";
import { getUpcomingMovies } from "@/lib/tmdb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escapeIcs(str: string) {
  return str.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

function toIcsDate(dateStr: string) {
  return dateStr.replace(/-/g, "");
}

export async function GET() {
  const [page1, page2] = await Promise.all([getUpcomingMovies(1), getUpcomingMovies(2)]);
  const movies = [...page1.results, ...page2.results].filter((m) => m.release_date);

  const events = movies
    .map((m) => {
      const date = toIcsDate(m.release_date);
      const uid = `movie-${m.id}@cinefind`;
      return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART;VALUE=DATE:${date}
SUMMARY:${escapeIcs(m.title)} — Release Day
DESCRIPTION:${escapeIcs(m.overview || "New release.")}\\n${SITE_URL}/movie/${m.id}
URL:${SITE_URL}/movie/${m.id}
END:VEVENT`;
    })
    .join("\n");

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CineFind//Upcoming Releases//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:CineFind Upcoming Releases
${events}
END:VCALENDAR`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="cinefind-upcoming.ics"',
    },
  });
}
