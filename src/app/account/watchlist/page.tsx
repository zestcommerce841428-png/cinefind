import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import AccountMediaTabs from "@/components/account/AccountMediaTabs";
import ExportButtons from "@/components/account/ExportButtons";
import SignInRequired from "@/components/account/SignInRequired";
import PosterWallExport from "@/components/media/PosterWallExport";
import Stack from "@mui/material/Stack";
import Link from "@/components/common/NextLink";
import { getAccountDetails, getWatchlistMovies, getWatchlistTv, getMovieDetails } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 0;
export const metadata: Metadata = { title: "My Watchlist", robots: { index: false } };

type SortMode = "default" | "hidden-gem" | "quick-win";

function hiddenGemScore(item: MovieSummary | TvSummary): number {
  // Rewards high ratings that haven't accumulated a huge vote count yet.
  return item.vote_average / Math.log10(item.vote_count + 10);
}

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string; sort?: string }>;
}) {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your watchlist" />;

  const { type, page, sort } = await searchParams;
  const activeTab = type === "tv" ? "tv" : "movie";
  const pageNum = Number(page) || 1;
  const sortMode: SortMode = sort === "hidden-gem" || sort === "quick-win" ? sort : "default";

  const account = await getAccountDetails(sessionId);
  const [movies, tv] = await Promise.all([
    getWatchlistMovies(account.id, sessionId, activeTab === "movie" ? pageNum : 1),
    getWatchlistTv(account.id, sessionId, activeTab === "tv" ? pageNum : 1),
  ]);

  if (sortMode === "hidden-gem") {
    movies.results = [...movies.results].sort((a, b) => hiddenGemScore(b) - hiddenGemScore(a));
    tv.results = [...tv.results].sort((a, b) => hiddenGemScore(b) - hiddenGemScore(a));
  } else if (sortMode === "quick-win" && activeTab === "movie" && movies.results.length > 0) {
    const details = await Promise.all(movies.results.map((m) => getMovieDetails(m.id).catch(() => null)));
    const runtimeById = new Map(details.map((d, i) => [movies.results[i].id, d?.runtime ?? null]));
    movies.results = [...movies.results].sort((a, b) => {
      const ra = runtimeById.get(a.id);
      const rb = runtimeById.get(b.id);
      const scoreA = a.vote_average - (ra ?? 999) / 30;
      const scoreB = b.vote_average - (rb ?? 999) / 30;
      return scoreB - scoreA;
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Watchlist
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: "wrap" }}>
        <ExportButtons type="watchlist" />
        <PosterWallExport
          items={[...movies.results, ...tv.results].map((m) => ({
            title: "title" in m ? m.title : m.name,
            posterPath: m.poster_path,
          }))}
          filename="cinefind-watchlist"
        />
      </Stack>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 3 }}>
        <Chip
          label="Default Order"
          component={Link}
          href={`/account/watchlist?type=${activeTab}`}
          clickable
          color={sortMode === "default" ? "secondary" : "default"}
        />
        <Chip
          label="Hidden Gems First"
          component={Link}
          href={`/account/watchlist?type=${activeTab}&sort=hidden-gem`}
          clickable
          color={sortMode === "hidden-gem" ? "secondary" : "default"}
        />
        {activeTab === "movie" && (
          <Chip
            label="Quick Wins First"
            component={Link}
            href={`/account/watchlist?type=movie&sort=quick-win`}
            clickable
            color={sortMode === "quick-win" ? "secondary" : "default"}
          />
        )}
      </Stack>
      <AccountMediaTabs
        basePath="/account/watchlist"
        activeTab={activeTab}
        page={pageNum}
        movies={movies}
        tv={tv}
      />
    </Container>
  );
}
