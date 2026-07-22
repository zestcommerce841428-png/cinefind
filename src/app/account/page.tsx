import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import SignInRequired from "@/components/account/SignInRequired";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  getAccountDetails,
  getFavoriteMovies,
  getFavoriteTv,
  getWatchlistMovies,
  getWatchlistTv,
  getRatedMovies,
  getRatedTv,
} from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import MediaGrid from "@/components/media/MediaGrid";
import RewatchReminder from "@/components/account/RewatchReminder";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function AccountPage() {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your account" />;

  const account = await getAccountDetails(sessionId);
  const [favMovies, favTv, wlMovies, wlTv, ratedMovies, ratedTv] = await Promise.all([
    getFavoriteMovies(account.id, sessionId),
    getFavoriteTv(account.id, sessionId),
    getWatchlistMovies(account.id, sessionId),
    getWatchlistTv(account.id, sessionId),
    getRatedMovies(account.id, sessionId),
    getRatedTv(account.id, sessionId),
  ]);

  const avatarPath = account.avatar?.tmdb?.avatar_path;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar
          src={avatarPath ? `https://image.tmdb.org/t/p/w185${avatarPath}` : undefined}
          sx={{ width: 64, height: 64 }}
        >
          {account.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {account.name || account.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{account.username}
          </Typography>
        </Box>
        <Button component={Link} href="/account/lists" variant="outlined">
          My Lists
        </Button>
        <Button component="a" href="/api/export/all" variant="outlined">
          Download Full Backup
        </Button>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outlined" color="inherit">
            Sign Out
          </Button>
        </form>
      </Stack>

      <RewatchReminder ratedMovies={ratedMovies.results} ratedTv={ratedTv.results} />

      <Section title="Favorite Movies" items={favMovies.results} mediaType="movie" />
      <Section title="Favorite TV Shows" items={favTv.results} mediaType="tv" />
      <Section title="Movie Watchlist" items={wlMovies.results} mediaType="movie" />
      <Section title="TV Watchlist" items={wlTv.results} mediaType="tv" />
      <Section title="Rated Movies" items={ratedMovies.results} mediaType="movie" />
      <Section title="Rated TV Shows" items={ratedTv.results} mediaType="tv" />
    </Container>
  );
}

function Section({
  title,
  items,
  mediaType,
}: {
  title: string;
  items: Parameters<typeof MediaGrid>[0]["items"];
  mediaType: "movie" | "tv";
}) {
  if (!items.length) return null;
  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
      <MediaGrid items={items} mediaType={mediaType} />
    </Box>
  );
}
