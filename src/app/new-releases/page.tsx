import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MediaGrid from "@/components/media/MediaGrid";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "New Releases This Month",
  description: "Movies released in theaters over the last 30 days, ranked by popularity.",
  alternates: { canonical: "/new-releases" },
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function NewReleasesPage() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const data = await discoverMovies({
    sort_by: "popularity.desc",
    "primary_release_date.gte": isoDate(thirtyDaysAgo),
    "primary_release_date.lte": isoDate(today),
    "vote_count.gte": 10,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        New Releases This Month
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Movies released in theaters over the last 30 days, ranked by popularity.
      </Typography>
      <MediaGrid items={data.results} mediaType="movie" />
    </Container>
  );
}
