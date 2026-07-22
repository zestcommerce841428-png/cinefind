import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

interface GenreFingerprintProps {
  items: (MovieSummary | TvSummary)[];
  genreNames: Map<number, string>;
}

export default function GenreFingerprint({ items, genreNames }: GenreFingerprintProps) {
  const counts = new Map<number, number>();
  for (const item of items) {
    for (const genreId of item.genre_ids ?? []) {
      counts.set(genreId, (counts.get(genreId) ?? 0) + 1);
    }
  }
  const top = [...counts.entries()]
    .filter(([id]) => genreNames.has(id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  if (top.length === 0) return null;

  const max = top[0][1];

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Genre Fingerprint
      </Typography>
      <Stack spacing={1.25}>
        {top.map(([id, count]) => (
          <Box key={id}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.25 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {genreNames.get(id)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {count}
              </Typography>
            </Stack>
            <Box sx={{ height: 8, borderRadius: 1, bgcolor: "action.hover", overflow: "hidden" }}>
              <Box
                sx={{
                  height: "100%",
                  width: `${(count / max) * 100}%`,
                  bgcolor: "secondary.main",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
