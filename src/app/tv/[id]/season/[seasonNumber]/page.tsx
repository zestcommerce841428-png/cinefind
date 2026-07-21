import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvSeasonDetails } from "@/lib/tmdb";

export const revalidate = 3600;

interface SeasonPageProps {
  params: Promise<{ id: string; seasonNumber: string }>;
}

async function loadSeason(id: string, seasonNumber: number) {
  try {
    return await Promise.all([getTvDetails(id), getTvSeasonDetails(id, seasonNumber)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { id, seasonNumber } = await params;
  const data = await loadSeason(id, Number(seasonNumber));
  if (!data) return { title: "Season Not Found" };
  const [tv, season] = data;
  return {
    title: `${tv.name} — ${season.name}`,
    description: season.overview || `Episode guide for ${tv.name} ${season.name}.`,
    alternates: { canonical: `/tv/${id}/season/${seasonNumber}` },
  };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id, seasonNumber } = await params;
  const data = await loadSeason(id, Number(seasonNumber));
  if (!data) notFound();
  const [tv, season] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/tv/${id}`}>{tv.name}</Link>
        <Typography color="text.primary">{season.name}</Typography>
      </Breadcrumbs>

      <Stack direction="row" sx={{ gap: 3, mb: 4, flexWrap: "wrap" }}>
        {season.poster_path && (
          <Box sx={{ position: "relative", width: 160, aspectRatio: "2 / 3", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
            <Image src={tmdbImage(season.poster_path, "w342")!} alt={season.name} fill style={{ objectFit: "cover" }} />
          </Box>
        )}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {season.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {season.air_date?.slice(0, 4)} • {season.episode_count} episodes
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 640 }}>
            {season.overview}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Episodes
      </Typography>
      <Stack spacing={2}>
        {season.episodes.map((ep) => (
          <Box
            key={ep.id}
            component={Link}
            href={`/tv/${id}/season/${seasonNumber}/episode/${ep.episode_number}`}
            sx={{
              display: "flex",
              gap: 2,
              textDecoration: "none",
              color: "inherit",
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 180,
                aspectRatio: "16 / 9",
                borderRadius: 1.5,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "action.hover",
                display: { xs: "none", sm: "block" },
              }}
            >
              {ep.still_path && (
                <Image src={tmdbImage(ep.still_path, "w300")!} alt={ep.name} fill style={{ objectFit: "cover" }} />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {ep.episode_number}. {ep.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                {ep.air_date} {ep.runtime ? `• ${ep.runtime}m` : ""}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ep.overview}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
