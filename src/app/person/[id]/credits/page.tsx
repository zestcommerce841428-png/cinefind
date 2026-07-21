import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getPersonDetails, getPersonCombinedCredits } from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

function yearOf(item: MovieSummary | TvSummary): string {
  const date = (item as MovieSummary).release_date ?? (item as TvSummary).first_air_date;
  return date?.slice(0, 4) || "Unknown";
}

async function loadData(id: string) {
  try {
    return await Promise.all([getPersonDetails(id), getPersonCombinedCredits(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [person] = data;
  return { title: `${person.name} — Full Filmography`, alternates: { canonical: `/person/${id}/credits` } };
}

export default async function PersonCreditsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [person, credits] = data;

  const dedupedCast = credits.cast.filter(
    (v, i, arr) => arr.findIndex((x) => x.id === v.id && x.media_type === v.media_type) === i
  );

  const byYear = dedupedCast.reduce<Record<string, (MovieSummary | TvSummary)[]>>((acc, item) => {
    const year = yearOf(item);
    (acc[year] ??= []).push(item);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => (b === "Unknown" ? -1 : Number(b) - Number(a)));

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/person/${id}`}>{person.name}</Link>
        <Typography color="text.primary">Full Filmography</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Full Filmography ({dedupedCast.length})
      </Typography>

      {years.map((year) => (
        <Box key={year} component="section" sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {year}
          </Typography>
          <MediaGrid items={byYear[year]} />
        </Box>
      ))}
    </Container>
  );
}
