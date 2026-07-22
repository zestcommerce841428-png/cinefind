import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { discoverMovies, getMovieDetails } from "@/lib/tmdb";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: "Runtime Explorer",
  description: "Which genres run longest? Average movie runtime by genre, from real TMDB data.",
  alternates: { canonical: "/insights/runtime" },
};

const GENRES: { id: number; name: string }[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
  { id: 16, name: "Animation" },
  { id: 14, name: "Fantasy" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 99, name: "Documentary" },
];

export default async function RuntimeExplorerPage() {
  const perGenre = await Promise.all(
    GENRES.map(async (genre) => {
      const list = await discoverMovies({
        with_genres: String(genre.id),
        sort_by: "popularity.desc",
        "vote_count.gte": 300,
      });
      const sample = list.results.slice(0, 8);
      const details = await Promise.all(sample.map((m) => getMovieDetails(m.id).catch(() => null)));
      const runtimes = details
        .map((d) => d?.runtime)
        .filter((r): r is number => typeof r === "number" && r > 0);
      const avg = runtimes.length > 0 ? runtimes.reduce((a, b) => a + b, 0) / runtimes.length : 0;
      return { ...genre, avg, sampleSize: runtimes.length };
    })
  );

  const sorted = perGenre.filter((g) => g.avg > 0).sort((a, b) => b.avg - a.avg);
  const maxAvg = sorted[0]?.avg ?? 1;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Runtime Explorer
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Average runtime by genre, sampled from currently popular, well-rated movies.
      </Typography>

      <Stack spacing={2}>
        {sorted.map((g) => (
          <Box key={g.id}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {g.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(g.avg)} min avg
              </Typography>
            </Stack>
            <Box sx={{ height: 14, borderRadius: 2, bgcolor: "action.hover", overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${(g.avg / maxAvg) * 100}%`,
                  bgcolor: "secondary.main",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4 }}>
        Based on a sample of the 8 most popular, high-vote-count movies per genre.
      </Typography>
    </Container>
  );
}
