import Link from "@/components/common/NextLink";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb/config";
import type { SeasonSummary } from "@/lib/tmdb/types";

export default function SeasonList({ tvId, seasons }: { tvId: number; seasons: SeasonSummary[] }) {
  const visible = seasons.filter((s) => s.season_number >= 0);
  if (!visible.length) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Seasons
      </Typography>
      <Grid container spacing={2}>
        {visible.map((season) => (
          <Grid key={season.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card
              component={Link}
              href={`/tv/${tvId}/season/${season.season_number}`}
              elevation={0}
              sx={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", aspectRatio: "2 / 3", bgcolor: "action.hover" }}>
                {season.poster_path && (
                  <Image
                    src={tmdbImage(season.poster_path, "w342")!}
                    alt={season.name}
                    fill
                    sizes="200px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {season.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {season.episode_count} episodes
                  {season.air_date ? ` • ${season.air_date.slice(0, 4)}` : ""}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
