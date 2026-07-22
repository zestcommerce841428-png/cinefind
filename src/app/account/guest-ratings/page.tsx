import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MediaCard from "@/components/media/MediaCard";
import { getGuestSessionRatedMovies, getGuestSessionRatedTv } from "@/lib/tmdb";
import { getGuestSessionId } from "@/lib/session";

export const revalidate = 0;
export const metadata: Metadata = { title: "Guest Ratings", robots: { index: false } };

export default async function GuestRatingsPage() {
  const guestSessionId = await getGuestSessionId();

  if (!guestSessionId) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
          No guest ratings yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rate a movie or TV show without signing in, and it&apos;ll show up here — tied to this
          browser&apos;s guest session.
        </Typography>
      </Container>
    );
  }

  const [movies, tv] = await Promise.all([
    getGuestSessionRatedMovies(guestSessionId),
    getGuestSessionRatedTv(guestSessionId),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Guest Ratings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Ratings made without signing in, tied to this browser&apos;s guest session. Sign in with TMDB
        to keep ratings permanently on your account instead.
      </Typography>

      {movies.results.length === 0 && tv.results.length === 0 ? (
        <Typography color="text.secondary">No guest ratings yet.</Typography>
      ) : (
        <>
          {movies.results.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Movies
              </Typography>
              <Grid container spacing={2}>
                {movies.results.map((m) => (
                  <Grid key={m.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                    <Box sx={{ position: "relative" }}>
                      <MediaCard
                        id={m.id}
                        title={m.title}
                        subtitle={m.release_date?.slice(0, 4)}
                        posterPath={m.poster_path}
                        voteAverage={m.vote_average}
                        mediaType="movie"
                      />
                      <Chip
                        label={`Your rating: ${m.rating}`}
                        size="small"
                        color="secondary"
                        sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tv.results.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                TV Shows
              </Typography>
              <Grid container spacing={2}>
                {tv.results.map((t) => (
                  <Grid key={t.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                    <Box sx={{ position: "relative" }}>
                      <MediaCard
                        id={t.id}
                        title={t.name}
                        subtitle={t.first_air_date?.slice(0, 4)}
                        posterPath={t.poster_path}
                        voteAverage={t.vote_average}
                        mediaType="tv"
                      />
                      <Chip
                        label={`Your rating: ${t.rating}`}
                        size="small"
                        color="secondary"
                        sx={{ position: "absolute", top: 8, left: 8, fontWeight: 700 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
