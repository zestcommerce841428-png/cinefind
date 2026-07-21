import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AccountMediaTabs from "@/components/account/AccountMediaTabs";
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
  if (!sessionId) redirect("/api/auth/login");

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
