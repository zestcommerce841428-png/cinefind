import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { getMovieWatchProvidersList, getTvWatchProvidersList } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Streaming Providers",
  description: "Browse movies and TV shows by streaming service — Netflix, Prime Video, Disney+, and more.",
  alternates: { canonical: "/watch-providers" },
};

export default async function WatchProvidersPage() {
  const [movieProviders, tvProviders] = await Promise.all([
    getMovieWatchProvidersList("US"),
    getTvWatchProvidersList("US"),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Streaming Providers
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Browse by streaming service (availability shown for the US region).
      </Typography>

      <Box component="section" sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Movies
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {movieProviders.results
            .sort((a, b) => a.provider_name.localeCompare(b.provider_name))
            .map((p) => (
              <Tooltip key={p.provider_id} title={p.provider_name}>
                <Box
                  component={Link}
                  href={`/movies/discover?with_watch_providers=${p.provider_id}&watch_region=US`}
                >
                  <Avatar
                    src={tmdbImage(p.logo_path, "w92") ?? undefined}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </Box>
              </Tooltip>
            ))}
        </Box>
      </Box>

      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          TV Shows
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {tvProviders.results
            .sort((a, b) => a.provider_name.localeCompare(b.provider_name))
            .map((p) => (
              <Tooltip key={p.provider_id} title={p.provider_name}>
                <Box
                  component={Link}
                  href={`/tv/discover?with_watch_providers=${p.provider_id}&watch_region=US`}
                >
                  <Avatar
                    src={tmdbImage(p.logo_path, "w92") ?? undefined}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                </Box>
              </Tooltip>
            ))}
        </Box>
      </Box>
    </Container>
  );
}
