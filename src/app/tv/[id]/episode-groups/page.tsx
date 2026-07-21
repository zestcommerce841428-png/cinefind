import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvEpisodeGroups } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvEpisodeGroups(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [tv] = data;
  return {
    title: `${tv.name} — Episode Groups`,
    alternates: { canonical: `/tv/${id}/episode-groups` },
  };
}

export default async function TvEpisodeGroupsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, groups] = data;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/tv/${id}`}>{tv.name}</Link>
        <Typography color="text.primary">Episode Groups</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Episode Groups
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Alternate episode orderings for {tv.name}, such as broadcast order, DVD order, or story
        arcs — as curated by the TMDB community.
      </Typography>

      {groups.results.length === 0 ? (
        <Typography color="text.secondary">No episode groups available.</Typography>
      ) : (
        <Stack spacing={2}>
          {groups.results.map((group) => (
            <Box
              key={group.id}
              sx={{ p: 2.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
            >
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {group.name}
                </Typography>
                <Chip label={`${group.group_count} groups • ${group.episode_count} episodes`} size="small" />
              </Stack>
              {group.description && (
                <Typography variant="body2" color="text.secondary">
                  {group.description}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
}
