import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

interface FilmographyDecadeHeatmapProps {
  items: (MovieSummary | TvSummary)[];
}

function creditYear(item: MovieSummary | TvSummary) {
  const date = "release_date" in item ? item.release_date : item.first_air_date;
  return date ? Number(date.slice(0, 4)) : null;
}

export default function FilmographyDecadeHeatmap({ items }: FilmographyDecadeHeatmapProps) {
  const counts = new Map<number, number>();
  for (const item of items) {
    const year = creditYear(item);
    if (!year || Number.isNaN(year)) continue;
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  if (counts.size < 5) return null;

  const years = [...counts.keys()];
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const startDecade = Math.floor(minYear / 10) * 10;
  const endDecade = Math.floor(maxYear / 10) * 10;
  const decades = Array.from(
    { length: (endDecade - startDecade) / 10 + 1 },
    (_, i) => startDecade + i * 10
  );
  const max = Math.max(...counts.values());

  function intensity(count: number) {
    if (count === 0) return "action.hover";
    const ratio = count / max;
    if (ratio > 0.75) return "primary.main";
    if (ratio > 0.4) return "primary.dark";
    return "primary.light";
  }

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
        Career Density by Decade
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Each cell is one year — darker means more credited titles released that year.
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, width: "fit-content" }}>
          {decades.map((decade) => (
            <Box key={decade} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography variant="caption" color="text.secondary" sx={{ width: 44, flexShrink: 0 }}>
                {decade}s
              </Typography>
              {Array.from({ length: 10 }, (_, i) => decade + i).map((year) => {
                const count = counts.get(year) ?? 0;
                return (
                  <Tooltip key={year} title={`${year}: ${count} credit${count === 1 ? "" : "s"}`}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: 0.75,
                        bgcolor: intensity(count),
                        flexShrink: 0,
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
