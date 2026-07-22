import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import { getUpcomingMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Release Calendar",
  description: "Upcoming movie release dates, grouped by day — subscribe to get them in your calendar app.",
  alternates: { canonical: "/calendar" },
};

export default async function CalendarPage() {
  const [page1, page2] = await Promise.all([getUpcomingMovies(1), getUpcomingMovies(2)]);
  const movies = [...page1.results, ...page2.results].filter((m) => m.release_date);

  const groups = new Map<string, typeof movies>();
  for (const movie of movies) {
    const key = movie.release_date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(movie);
  }
  const sortedDates = [...groups.keys()].sort();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Release Calendar
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CalendarMonthIcon />}
          component="a"
          href="/api/calendar/upcoming.ics"
          download
        >
          Subscribe (.ics)
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Upcoming theatrical releases, grouped by date. Add the calendar file to Google Calendar,
        Apple Calendar, or Outlook to get reminders automatically.
      </Typography>

      <Stack spacing={4}>
        {sortedDates.map((date) => (
          <Box key={date}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <MediaGrid items={groups.get(date)!} mediaType="movie" />
          </Box>
        ))}
        {sortedDates.length === 0 && (
          <Typography color="text.secondary">No upcoming release dates found right now.</Typography>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: "block" }}>
        Prefer to browse instead? See <Link href="/movies/upcoming">all upcoming movies</Link>.
      </Typography>
    </Container>
  );
}
