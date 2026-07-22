import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Link from "@/components/common/NextLink";
import { getTrending, getMovieGenres } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Genre Popularity Trends",
  description: "Which genres are most represented in today's trending movies, right now.",
  alternates: { canonical: "/trends/genres" },
};

export default async function GenreTrendsPage() {
  const [trendingDay, trendingWeek, genresData] = await Promise.all([
    getTrending("movie", "day", 1),
    getTrending("movie", "week", 1),
    getMovieGenres(),
  ]);

  const genreNames = new Map(genresData.genres.map((g) => [g.id, g.name] as const));

  function tally(items: MovieSummary[]) {
    const counts = new Map<number, number>();
    for (const item of items) {
      for (const genreId of item.genre_ids) {
        counts.set(genreId, (counts.get(genreId) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .filter(([id]) => genreNames.has(id))
      .sort((a, b) => b[1] - a[1]);
  }

  const dayTally = tally(trendingDay.results as MovieSummary[]);
  const max = dayTally[0]?.[1] ?? 1;
  const weekCounts = new Map(tally(trendingWeek.results as MovieSummary[]));

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Genre Popularity Trends
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        A live snapshot of which genres show up most often in today&apos;s and this week&apos;s
        trending movies — not a historical average.
      </Typography>

      <Stack spacing={1.5}>
        {dayTally.map(([id, count]) => (
          <Box key={id}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.25 }}>
              <Link href={`/genre/movie/${id}`} style={{ fontWeight: 600 }}>
                {genreNames.get(id)}
              </Link>
              <Typography variant="caption" color="text.secondary">
                {count} today · {weekCounts.get(id) ?? 0} this week
              </Typography>
            </Stack>
            <Box sx={{ height: 8, borderRadius: 1, bgcolor: "action.hover", overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${(count / max) * 100}%`,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
