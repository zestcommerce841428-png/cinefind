import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getNetworkDetails, discoverTv } from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";

export const revalidate = 3600;

interface NetworkPageProps {
  params: Promise<{ id: string }>;
}

async function loadNetwork(id: string) {
  try {
    return await Promise.all([getNetworkDetails(id), discoverTv({ with_networks: id })]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: NetworkPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadNetwork(id);
  if (!data) return { title: "Network Not Found" };
  const [network] = data;
  return {
    title: network.name,
    description: `TV shows from ${network.name}.`,
    alternates: { canonical: `/network/${id}` },
  };
}

export default async function NetworkPage({ params }: NetworkPageProps) {
  const { id } = await params;
  const data = await loadNetwork(id);
  if (!data) notFound();
  const [network, shows] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 2, mb: 4 }}>
        {network.logo_path && (
          <Avatar
            src={tmdbImage(network.logo_path, "w185") ?? undefined}
            variant="rounded"
            sx={{ width: 72, height: 72, bgcolor: "#fff" }}
          />
        )}
        <Stack>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {network.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {network.headquarters}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        TV Shows
      </Typography>
      <MediaGrid items={shows.results} mediaType="tv" />
    </Container>
  );
}
