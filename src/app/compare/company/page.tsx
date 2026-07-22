import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ComparePickerForm from "@/components/compare/ComparePickerForm";
import MediaGrid from "@/components/media/MediaGrid";
import { getCompanyDetails, discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Studio Showdown — Compare Production Companies",
  description: "Compare two production companies by catalog size, average rating, and top titles.",
  alternates: { canonical: "/compare/company" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function loadStudio(id: string) {
  const [company, topRated, mostPopular] = await Promise.all([
    getCompanyDetails(id),
    discoverMovies({ with_companies: id, sort_by: "vote_average.desc", "vote_count.gte": 50, page: 1 }),
    discoverMovies({ with_companies: id, sort_by: "popularity.desc", page: 1 }),
  ]);
  const avgRating =
    mostPopular.results.length > 0
      ? mostPopular.results.reduce((sum, m) => sum + m.vote_average, 0) / mostPopular.results.length
      : 0;
  return { company, topRated, mostPopular, avgRating };
}

function StudioColumn({ data }: { data: Awaited<ReturnType<typeof loadStudio>> }) {
  const { company, mostPopular, avgRating } = data;
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {company.name}
      </Typography>
      <Stack direction="row" spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {mostPopular.total_results.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            movies on TMDB
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
        Most popular titles
      </Typography>
      <MediaGrid items={mostPopular.results.slice(0, 6)} mediaType="movie" />
    </Stack>
  );
}

export default async function CompareCompanyPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let content = null;
  if (a && b) {
    const [studioA, studioB] = await Promise.all([loadStudio(a), loadStudio(b)]);
    content = (
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StudioColumn data={studioA} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StudioColumn data={studioB} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Studio Showdown
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Compare two production companies by catalog size, average rating, and their most popular titles.
      </Typography>
      <ComparePickerForm kind="company" />
      {content}
    </Container>
  );
}
