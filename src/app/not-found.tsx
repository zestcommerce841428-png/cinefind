import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import MediaCard from "@/components/media/MediaCard";
import { getTrending } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/tmdb/types";

export default async function NotFound() {
  const trending = await getTrending("movie", "day", 1).catch(() => null);
  const suggestions = ((trending?.results as MovieSummary[]) ?? []).slice(0, 6);

  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 64, md: 96 }, opacity: 0.2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Scene not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        We couldn&apos;t find the page you were looking for. It may have been moved, or never existed.
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "center", gap: 2, mb: 6 }}>
        <Button component={Link} href="/" variant="contained">
          Back Home
        </Button>
        <Button component={Link} href="/search" variant="outlined">
          Search Instead
        </Button>
      </Stack>

      {suggestions.length > 0 && (
        <Stack spacing={2} sx={{ textAlign: "left" }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: "center" }}>
            While you&apos;re here — what&apos;s trending today
          </Typography>
          <Grid container spacing={2}>
            {suggestions.map((m) => (
              <Grid key={m.id} size={{ xs: 6, sm: 4, md: 2 }}>
                <MediaCard
                  id={m.id}
                  title={m.title}
                  subtitle={m.release_date?.slice(0, 4)}
                  posterPath={m.poster_path}
                  voteAverage={m.vote_average}
                  mediaType="movie"
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
    </Container>
  );
}
