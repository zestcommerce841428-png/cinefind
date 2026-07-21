import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { tmdbImage } from "@/lib/tmdb/config";
import RatingBadge from "./RatingBadge";

interface DetailHeroProps {
  title: string;
  tagline?: string | null;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseInfo: string;
  genres: { id: number; name: string }[];
  metaChips?: string[];
  actions?: React.ReactNode;
}

export default function DetailHero({
  title,
  tagline,
  overview,
  posterPath,
  backdropPath,
  voteAverage,
  releaseInfo,
  genres,
  metaChips = [],
  actions,
}: DetailHeroProps) {
  const backdrop = tmdbImage(backdropPath, "original");
  const poster = tmdbImage(posterPath, "w500");

  return (
    <Box sx={{ position: "relative" }}>
      {backdrop && (
        <Box sx={{ position: "absolute", inset: 0, height: { xs: 260, md: 460 }, overflow: "hidden" }}>
          <Image src={backdrop} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: (t) =>
                `linear-gradient(to top, ${t.palette.background.default} 5%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.5))`,
            }}
          />
        </Box>
      )}
      <Container maxWidth="lg" sx={{ position: "relative", pt: { xs: 4, md: 10 }, pb: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 5, sm: 3, md: 2.5 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "2 / 3",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 6,
                bgcolor: "action.hover",
              }}
            >
              {poster && (
                <Image src={poster} alt={title} fill sizes="300px" style={{ objectFit: "cover" }} priority />
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, md: 9.5 }}>
            <Typography variant="h3" id="overview" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 40 } }}>
              {title}
            </Typography>
            {tagline && (
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: "italic", mb: 1 }}>
                {tagline}
              </Typography>
            )}
            <Stack direction="row" sx={{ alignItems: "center", gap: 2, flexWrap: "wrap", my: 2 }}>
              <RatingBadge voteAverage={voteAverage} />
              <Typography variant="body2" color="text.secondary">
                {releaseInfo}
              </Typography>
              {metaChips.map((chip) => (
                <Chip key={chip} label={chip} size="small" variant="outlined" />
              ))}
            </Stack>
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
              {genres.map((g) => (
                <Chip key={g.id} label={g.name} size="small" />
              ))}
            </Stack>
            <Typography variant="body1" sx={{ maxWidth: 720, opacity: 0.9 }}>
              {overview}
            </Typography>
            {actions && <Box sx={{ mt: 3 }}>{actions}</Box>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
