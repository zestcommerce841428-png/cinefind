import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ComparePickerForm from "@/components/compare/ComparePickerForm";
import CompareTable from "@/components/compare/CompareTable";
import { getMovieDetails } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Compare Movies",
  description: "Compare two movies side by side — ratings, budget, revenue, runtime, and more.",
  alternates: { canonical: "/compare/movie" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function CompareMoviePage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let table = null;
  if (a && b) {
    const [movieA, movieB] = await Promise.all([getMovieDetails(a), getMovieDetails(b)]);
    table = (
      <CompareTable a={movieA} b={movieB} aId={movieA.id} bId={movieB.id} mediaType="movie" />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Compare Movies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick two movies to compare ratings, budget, revenue, runtime, and genres side by side.
      </Typography>
      <ComparePickerForm mediaType="movie" />
      {table}
    </Container>
  );
}
