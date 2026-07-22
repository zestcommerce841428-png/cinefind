import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AccountMediaTabs from "@/components/account/AccountMediaTabs";
import ExportButtons from "@/components/account/ExportButtons";
import SignInRequired from "@/components/account/SignInRequired";
import { getAccountDetails, getWatchlistMovies, getWatchlistTv } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export const revalidate = 0;
export const metadata: Metadata = { title: "My Watchlist", robots: { index: false } };

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your watchlist" />;

  const { type, page } = await searchParams;
  const activeTab = type === "tv" ? "tv" : "movie";
  const pageNum = Number(page) || 1;

  const account = await getAccountDetails(sessionId);
  const [movies, tv] = await Promise.all([
    getWatchlistMovies(account.id, sessionId, activeTab === "movie" ? pageNum : 1),
    getWatchlistTv(account.id, sessionId, activeTab === "tv" ? pageNum : 1),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Watchlist
      </Typography>
      <ExportButtons type="watchlist" />
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
