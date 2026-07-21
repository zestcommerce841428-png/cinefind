import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvEpisodeDetails } from "@/lib/tmdb";
import CastRow from "@/components/media/CastRow";
import RatingBadge from "@/components/media/RatingBadge";
import Stack from "@mui/material/Stack";

export const revalidate = 3600;

interface EpisodePageProps {
  params: Promise<{ id: string; seasonNumber: string; episodeNumber: string }>;
}

async function loadEpisode(id: string, seasonNumber: number, episodeNumber: number) {
  try {
    return await Promise.all([
      getTvDetails(id),
      getTvEpisodeDetails(id, seasonNumber, episodeNumber),
    ]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { id, seasonNumber, episodeNumber } = await params;
  const data = await loadEpisode(id, Number(seasonNumber), Number(episodeNumber));
  if (!data) return { title: "Episode Not Found" };
  const [tv, episode] = data;
  return {
    title: `${tv.name} — S${seasonNumber}E${episodeNumber}: ${episode.name}`,
    description: episode.overview || `Episode details for ${tv.name} season ${seasonNumber}.`,
    alternates: { canonical: `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}` },
  };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, seasonNumber, episodeNumber } = await params;
  const data = await loadEpisode(id, Number(seasonNumber), Number(episodeNumber));
  if (!data) notFound();
  const [tv, episode] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/tv/${id}`}>{tv.name}</Link>
        <Link href={`/tv/${id}/season/${seasonNumber}`}>Season {seasonNumber}</Link>
        <Typography color="text.primary">Episode {episodeNumber}</Typography>
      </Breadcrumbs>

      {episode.still_path && (
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 3, overflow: "hidden", mb: 3 }}>
          <Image src={tmdbImage(episode.still_path, "w780")!} alt={episode.name} fill style={{ objectFit: "cover" }} priority />
        </Box>
      )}

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {episode.episode_number}. {episode.name}
      </Typography>
      <Stack direction="row" sx={{ alignItems: "center", gap: 2, mb: 2 }}>
        <RatingBadge voteAverage={episode.vote_average} />
        <Typography variant="body2" color="text.secondary">
          {episode.air_date} {episode.runtime ? `• ${episode.runtime}m` : ""}
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ maxWidth: 720, mb: 4 }}>
        {episode.overview}
      </Typography>

      {episode.credits?.cast?.length > 0 && <CastRow cast={episode.credits.cast} />}
    </Container>
  );
}
