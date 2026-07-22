import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import MediaCard from "@/components/media/MediaCard";
import { getOnTheAirTv, getTvDetails } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "New Seasons",
  description: "Returning TV shows currently airing a new season (not their debut season).",
  alternates: { canonical: "/new-seasons" },
};

export default async function NewSeasonsPage() {
  const [page1, page2] = await Promise.all([getOnTheAirTv(1), getOnTheAirTv(2)]);
  const candidates = [...page1.results, ...page2.results];

  const details = await Promise.all(candidates.map((tv) => getTvDetails(tv.id).catch(() => null)));

  const returning = details
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .filter((d) => (d.last_episode_to_air?.season_number ?? 1) > 1)
    .sort((a, b) => b.popularity - a.popularity);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        New Seasons
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Shows currently on the air that are past their first season — good picks if you&apos;re
        looking for something already proven.
      </Typography>

      <Grid container spacing={2}>
        {returning.map((show) => (
          <Grid key={show.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <Box sx={{ position: "relative" }}>
              <MediaCard
                id={show.id}
                title={show.name}
                subtitle={show.first_air_date?.slice(0, 4)}
                posterPath={show.poster_path}
                voteAverage={show.vote_average}
                mediaType="tv"
              />
              {show.last_episode_to_air && (
                <Chip
                  label={`S${show.last_episode_to_air.season_number}`}
                  size="small"
                  color="secondary"
                  sx={{ position: "absolute", top: 8, right: 8, fontWeight: 700 }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {returning.length === 0 && (
        <Typography color="text.secondary">No returning shows found right now.</Typography>
      )}
    </Container>
  );
}
