import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvContentRatings } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvContentRatings(id)]);
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
    title: `${tv.name} — Content Ratings`,
    alternates: { canonical: `/tv/${id}/content-ratings` },
  };
}

export default async function TvContentRatingsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, ratings] = data;
  const sorted = [...ratings.results].sort((a, b) => a.iso_3166_1.localeCompare(b.iso_3166_1));

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/tv/${id}`}>{tv.name}</Link>
        <Typography color="text.primary">Content Ratings</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Content Ratings by Country
      </Typography>
      <Stack spacing={1.5}>
        {sorted.map((r) => (
          <Stack key={r.iso_3166_1} direction="row" sx={{ alignItems: "center", gap: 2 }}>
            <Chip label={r.iso_3166_1} size="small" variant="outlined" sx={{ minWidth: 56 }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {r.rating || "Not Rated"}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
