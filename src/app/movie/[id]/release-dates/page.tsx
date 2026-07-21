import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieReleaseDates } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

const RELEASE_TYPE_LABELS: Record<number, string> = {
  1: "Premiere",
  2: "Limited Theatrical",
  3: "Theatrical",
  4: "Digital",
  5: "Physical",
  6: "TV",
};

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieReleaseDates(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [movie] = data;
  return {
    title: `${movie.title} — Release Dates & Certifications`,
    alternates: { canonical: `/movie/${id}/release-dates` },
  };
}

export default async function MovieReleaseDatesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, releaseDates] = data;

  const sorted = [...releaseDates.results].sort((a, b) =>
    a.iso_3166_1.localeCompare(b.iso_3166_1)
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/movie/${id}`}>{movie.title}</Link>
        <Typography color="text.primary">Release Dates</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Release Dates &amp; Certifications
      </Typography>

      {sorted.length === 0 && (
        <Typography color="text.secondary">No release date data available.</Typography>
      )}

      <Stack spacing={2.5}>
        {sorted.map((country) => (
          <Box key={country.iso_3166_1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              {country.iso_3166_1}
            </Typography>
            <Stack spacing={1}>
              {country.release_dates.map((rd, i) => (
                <Stack key={i} direction="row" sx={{ alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                  {rd.certification && (
                    <Chip label={rd.certification} size="small" sx={{ fontWeight: 700, minWidth: 48 }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {RELEASE_TYPE_LABELS[rd.type] ?? "Release"}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
