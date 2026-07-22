import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SignInRequired from "@/components/account/SignInRequired";
import Link from "@/components/common/NextLink";
import MediaCard from "@/components/media/MediaCard";
import {
  getAccountDetails,
  getRatedMovies,
  getRatedTv,
  getFavoriteMovies,
  getFavoriteTv,
  getWatchlistMovies,
  getWatchlistTv,
} from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 0;
export const metadata: Metadata = { title: "Your Yearly Recap", robots: { index: false } };

interface PageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function RecapPage({ searchParams }: PageProps) {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your yearly recap" />;

  const { year } = await searchParams;

  const account = await getAccountDetails(sessionId);
  const [ratedMovies, ratedTv, favMovies, favTv, wlMovies, wlTv] = await Promise.all([
    getRatedMovies(account.id, sessionId),
    getRatedTv(account.id, sessionId),
    getFavoriteMovies(account.id, sessionId),
    getFavoriteTv(account.id, sessionId),
    getWatchlistMovies(account.id, sessionId),
    getWatchlistTv(account.id, sessionId),
  ]);

  type Combined = { id: number; title: string; posterPath: string | null; voteAverage: number; releaseYear: string; mediaType: "movie" | "tv"; rating?: number };

  const combine = (movies: MovieSummary[], tv: TvSummary[]): Combined[] => [
    ...movies.map((m) => ({
      id: m.id,
      title: m.title,
      posterPath: m.poster_path,
      voteAverage: m.vote_average,
      releaseYear: m.release_date?.slice(0, 4) ?? "",
      mediaType: "movie" as const,
      rating: (m as MovieSummary & { rating?: number }).rating,
    })),
    ...tv.map((t) => ({
      id: t.id,
      title: t.name,
      posterPath: t.poster_path,
      voteAverage: t.vote_average,
      releaseYear: t.first_air_date?.slice(0, 4) ?? "",
      mediaType: "tv" as const,
      rating: (t as TvSummary & { rating?: number }).rating,
    })),
  ];

  const all = [
    ...combine(ratedMovies.results, ratedTv.results),
    ...combine(favMovies.results, favTv.results),
    ...combine(wlMovies.results, wlTv.results),
  ];
  const unique = Array.from(new Map(all.map((item) => [`${item.mediaType}-${item.id}`, item])).values());

  const availableYears = Array.from(new Set(unique.map((i) => i.releaseYear).filter(Boolean))).sort(
    (a, b) => Number(b) - Number(a)
  );
  const selectedYear = year && availableYears.includes(year) ? year : availableYears[0];

  if (!selectedYear) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
          No recap yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rate, favorite, or watchlist a few titles, then come back to see your yearly recap.
        </Typography>
      </Container>
    );
  }

  const yearItems = unique.filter((i) => i.releaseYear === selectedYear);
  const ratedYearItems = yearItems.filter((i) => typeof i.rating === "number");
  const avgRating =
    ratedYearItems.length > 0
      ? (ratedYearItems.reduce((sum, i) => sum + (i.rating ?? 0), 0) / ratedYearItems.length).toFixed(1)
      : null;
  const topRated = [...yearItems].sort((a, b) => b.voteAverage - a.voteAverage)[0];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Your {selectedYear} Recap
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Titles released in {selectedYear} that you rated, favorited, or watchlisted.
      </Typography>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 4 }}>
        {availableYears.map((y) => (
          <Chip
            key={y}
            label={y}
            component={Link}
            href={`/account/recap?year=${y}`}
            clickable
            color={y === selectedYear ? "secondary" : "default"}
          />
        ))}
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {yearItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Titles from {selectedYear}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {avgRating ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your average rating
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {topRated?.title ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top pick of {selectedYear}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          All {selectedYear} Titles
        </Typography>
        <Grid container spacing={2}>
          {yearItems.map((item) => (
            <Grid key={`${item.mediaType}-${item.id}`} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
              <MediaCard
                id={item.id}
                title={item.title}
                subtitle={item.releaseYear}
                posterPath={item.posterPath}
                voteAverage={item.voteAverage}
                mediaType={item.mediaType}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
