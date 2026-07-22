import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import NetworkPickerForm from "@/components/compare/NetworkPickerForm";
import MediaGrid from "@/components/media/MediaGrid";
import { getNetworkDetails, discoverTv } from "@/lib/tmdb";
import { FEATURED_NETWORK_IDS } from "@/lib/networks";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Compare Networks — Streaming Service Showdown",
  description: "Compare two TV networks or streaming services by catalog size, average rating, and top shows.",
  alternates: { canonical: "/compare/network" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function loadNetwork(id: string) {
  const [network, popular] = await Promise.all([
    getNetworkDetails(id),
    discoverTv({ with_networks: id, sort_by: "popularity.desc", page: 1 }),
  ]);
  const avgRating =
    popular.results.length > 0
      ? popular.results.reduce((sum, t) => sum + t.vote_average, 0) / popular.results.length
      : 0;
  return { network, popular, avgRating };
}

function NetworkColumn({ data }: { data: Awaited<ReturnType<typeof loadNetwork>> }) {
  const { network, popular, avgRating } = data;
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {network.name}
      </Typography>
      <Stack direction="row" spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {popular.total_results.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            shows on TMDB
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {avgRating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            avg. rating (top page)
          </Typography>
        </Box>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        Most popular shows
      </Typography>
      <MediaGrid items={popular.results.slice(0, 6)} mediaType="tv" />
    </Stack>
  );
}

export default async function CompareNetworkPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;
  const networks = await Promise.all(
    FEATURED_NETWORK_IDS.map((id) => getNetworkDetails(id).then((n) => ({ id: n.id, name: n.name })))
  );

  let content = null;
  if (a && b) {
    const [networkA, networkB] = await Promise.all([loadNetwork(a), loadNetwork(b)]);
    content = (
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <NetworkColumn data={networkA} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NetworkColumn data={networkB} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Compare Networks
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Compare two networks or streaming services by catalog size, average rating, and their most
        popular shows.
      </Typography>
      <NetworkPickerForm networks={networks} />
      {content}
    </Container>
  );
}
