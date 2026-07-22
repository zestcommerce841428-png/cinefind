import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

interface FilmographyTimelineProps {
  items: (MovieSummary | TvSummary)[];
}

function creditYear(item: MovieSummary | TvSummary) {
  const date = "release_date" in item ? item.release_date : item.first_air_date;
  return date ? Number(date.slice(0, 4)) : null;
}

export default function FilmographyTimeline({ items }: FilmographyTimelineProps) {
  const counts = new Map<number, number>();
  for (const item of items) {
    const year = creditYear(item);
    if (!year || Number.isNaN(year)) continue;
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  const years = [...counts.keys()].sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const allYears = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  const max = Math.max(...counts.values());

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Career Timeline
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: allYears.length > 60 ? 0.5 : 1,
          height: 100,
          overflowX: "auto",
          pb: 1,
        }}
      >
        {allYears.map((year) => {
          const count = counts.get(year) ?? 0;
          const heightPct = max > 0 ? Math.max((count / max) * 100, count > 0 ? 8 : 3) : 3;
          return (
            <Tooltip key={year} title={`${year}: ${count} credit${count === 1 ? "" : "s"}`}>
              <Box
                sx={{
                  flex: allYears.length > 40 ? "0 0 6px" : "0 0 14px",
                  height: `${heightPct}%`,
                  bgcolor: count > 0 ? "primary.main" : "action.hover",
                  borderRadius: 1,
                  minHeight: 3,
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {minYear} – {maxYear}, by number of credited titles per year
      </Typography>
    </Box>
  );
}
