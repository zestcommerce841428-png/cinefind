import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SignInRequired from "@/components/account/SignInRequired";
import TasteProfileCardExport from "@/components/account/TasteProfileCardExport";
import {
  getAccountDetails,
  getRatedMovies,
  getRatedTv,
  getFavoriteMovies,
  getFavoriteTv,
  getWatchlistMovies,
  getWatchlistTv,
  getMovieGenres,
  getTvGenres,
  getMovieCredits,
  getTvCredits,
} from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";
import { matchPersonas } from "@/lib/tastePersonas";

export const revalidate = 0;
export const metadata: Metadata = { title: "Your Taste Profile", robots: { index: false } };

function decadeOf(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const year = Number(dateStr.slice(0, 4));
  if (!year) return null;
  return `${Math.floor(year / 10) * 10}s`;
}

export default async function TasteProfilePage() {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your taste profile" />;

  const account = await getAccountDetails(sessionId);
  const [ratedMovies, ratedTv, favMovies, favTv, wlMovies, wlTv, movieGenres, tvGenres] =
    await Promise.all([
      getRatedMovies(account.id, sessionId),
      getRatedTv(account.id, sessionId),
      getFavoriteMovies(account.id, sessionId),
      getFavoriteTv(account.id, sessionId),
      getWatchlistMovies(account.id, sessionId),
      getWatchlistTv(account.id, sessionId),
      getMovieGenres(),
      getTvGenres(),
    ]);

  const allMovies: MovieSummary[] = [
    ...ratedMovies.results,
    ...favMovies.results,
    ...wlMovies.results,
  ];
  const allTv: TvSummary[] = [...ratedTv.results, ...favTv.results, ...wlTv.results];

  const uniqueMovies = Array.from(new Map(allMovies.map((m) => [m.id, m])).values());
  const uniqueTv = Array.from(new Map(allTv.map((t) => [t.id, t])).values());

  const total = uniqueMovies.length + uniqueTv.length;

  if (total === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
          Not enough data yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rate, favorite, or watchlist a few movies and shows, then come back to see your taste
          profile.
        </Typography>
      </Container>
    );
  }

  const movieGenreMap = new Map(movieGenres.genres.map((g) => [g.id, g.name]));
  const tvGenreMap = new Map(tvGenres.genres.map((g) => [g.id, g.name]));

  const genreCounts = new Map<string, number>();
  for (const m of uniqueMovies) {
    for (const gid of m.genre_ids) {
      const name = movieGenreMap.get(gid);
      if (name) genreCounts.set(name, (genreCounts.get(name) ?? 0) + 1);
    }
  }
  for (const t of uniqueTv) {
    for (const gid of t.genre_ids) {
      const name = tvGenreMap.get(gid);
      if (name) genreCounts.set(name, (genreCounts.get(name) ?? 0) + 1);
    }
  }
  const topGenres = Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxGenreCount = topGenres[0]?.[1] ?? 1;
  const personaMatches = matchPersonas(genreCounts).filter((m) => m.score > 0);

  const decadeCounts = new Map<string, number>();
  for (const m of uniqueMovies) {
    const d = decadeOf(m.release_date);
    if (d) decadeCounts.set(d, (decadeCounts.get(d) ?? 0) + 1);
  }
  for (const t of uniqueTv) {
    const d = decadeOf(t.first_air_date);
    if (d) decadeCounts.set(d, (decadeCounts.get(d) ?? 0) + 1);
  }
  const topDecades = Array.from(decadeCounts.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const avgMovieRating =
    ratedMovies.results.length > 0
      ? (
          ratedMovies.results.reduce((sum, m) => sum + ((m as { rating?: number }).rating ?? 0), 0) /
          ratedMovies.results.length
        ).toFixed(1)
      : null;

  // Sample a handful of titles to derive top-billed cast frequency.
  const sampleMovies = uniqueMovies.slice(0, 10);
  const sampleTv = uniqueTv.slice(0, 10);
  const [movieCreditsList, tvCreditsList] = await Promise.all([
    Promise.all(sampleMovies.map((m) => getMovieCredits(m.id).catch(() => null))),
    Promise.all(sampleTv.map((t) => getTvCredits(t.id).catch(() => null))),
  ]);

  const actorCounts = new Map<string, { count: number; profilePath: string | null }>();
  for (const credits of [...movieCreditsList, ...tvCreditsList]) {
    if (!credits) continue;
    for (const actor of credits.cast.slice(0, 5)) {
      const existing = actorCounts.get(actor.name);
      if (existing) existing.count += 1;
      else actorCounts.set(actor.name, { count: 1, profilePath: actor.profile_path });
    }
  }
  const topActors = Array.from(actorCounts.entries())
    .filter(([, v]) => v.count > 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Your Taste Profile
        </Typography>
        <TasteProfileCardExport
          total={total}
          topGenres={topGenres}
          personaLabel={personaMatches[0]?.persona.label}
          personaEmoji={personaMatches[0]?.persona.emoji}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Built from {total} rated, favorited, and watchlisted titles.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Titles tracked
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {avgMovieRating ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average rating you give movies
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {topGenres[0]?.[0] ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your #1 genre
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Genre Breakdown
        </Typography>
        <Stack spacing={1.5}>
          {topGenres.map(([name, count]) => (
            <Box key={name}>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {count}
                </Typography>
              </Stack>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover", overflow: "hidden" }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${(count / maxGenreCount) * 100}%`,
                    bgcolor: "secondary.main",
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {personaMatches.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Your Closest Taste Personas
          </Typography>
          <Grid container spacing={2}>
            {personaMatches.map(({ persona, score }) => (
              <Grid key={persona.slug} size={{ xs: 12, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                  <Typography sx={{ fontSize: 28, mb: 0.5 }}>{persona.emoji}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {persona.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {persona.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(score * 100)}% match
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {topDecades.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Decades You Watch
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {topDecades.map(([decade, count]) => (
              <Chip key={decade} label={`${decade} · ${count}`} variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}

      {topActors.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Actors You Keep Coming Back To
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on top-billed cast across a sample of your titles.
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {topActors.map(([name, { count }]) => (
              <Chip key={name} label={`${name} · ${count}×`} />
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}
