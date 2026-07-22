import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AccountMediaTabs from "@/components/account/AccountMediaTabs";
import ExportButtons from "@/components/account/ExportButtons";
import SignInRequired from "@/components/account/SignInRequired";
import PosterWallExport from "@/components/media/PosterWallExport";
import Stack from "@mui/material/Stack";
import { getAccountDetails, getFavoriteMovies, getFavoriteTv } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";

export const revalidate = 0;
export const metadata: Metadata = { title: "My Favorites", robots: { index: false } };

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your favorites" />;

  const { type, page } = await searchParams;
  const activeTab = type === "tv" ? "tv" : "movie";
  const pageNum = Number(page) || 1;

  const account = await getAccountDetails(sessionId);
  const [movies, tv] = await Promise.all([
    getFavoriteMovies(account.id, sessionId, activeTab === "movie" ? pageNum : 1),
    getFavoriteTv(account.id, sessionId, activeTab === "tv" ? pageNum : 1),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Favorites
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: "wrap" }}>
        <ExportButtons type="favorites" />
        <PosterWallExport
          items={[...movies.results, ...tv.results].map((m) => ({
            title: "title" in m ? m.title : m.name,
            posterPath: m.poster_path,
          }))}
          filename="cinefind-favorites"
        />
      </Stack>
      <AccountMediaTabs
        basePath="/account/favorites"
        activeTab={activeTab}
        page={pageNum}
        movies={movies}
        tv={tv}
      />
    </Container>
  );
}
