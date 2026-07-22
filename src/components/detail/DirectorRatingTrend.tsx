import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

type DirectingCredit = (MovieSummary | TvSummary) & { job: string };

export default function DirectorRatingTrend({ crew }: { crew: DirectingCredit[] }) {
  const directed = crew
    .filter((c) => c.job === "Director")
    .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
    .map((c) => ({
      id: c.id,
      title: "title" in c ? c.title : c.name,
      year: ("release_date" in c ? c.release_date : c.first_air_date)?.slice(0, 4),
      rating: c.vote_average,
    }))
    .filter((c) => c.year && c.rating > 0)
    .sort((a, b) => Number(a.year) - Number(b.year));

  if (directed.length < 4) return null;

  const max = Math.max(...directed.map((d) => d.rating));

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
        Directing Career Trajectory
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Audience rating of each film directed, in order of release.
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 140, overflowX: "auto", pb: 1 }}>
        {directed.map((d) => (
          <Stack key={d.id} sx={{ alignItems: "center", minWidth: 44 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {d.rating.toFixed(1)}
            </Typography>
            <Box
              sx={{
                width: 24,
                height: Math.max((d.rating / max) * 90, 6),
                bgcolor: "secondary.main",
                borderRadius: 1,
              }}
              title={d.title}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {d.year}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
