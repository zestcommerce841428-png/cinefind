import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ComparePickerForm from "@/components/compare/ComparePickerForm";
import CompareTable from "@/components/compare/CompareTable";
import { getTvDetails } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Compare TV Shows",
  description: "Compare two TV shows side by side — ratings, seasons, episodes, and more.",
  alternates: { canonical: "/compare/tv" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function CompareTvPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let table = null;
  if (a && b) {
    const [tvA, tvB] = await Promise.all([getTvDetails(a), getTvDetails(b)]);
    table = <CompareTable a={tvA} b={tvB} aId={tvA.id} bId={tvB.id} mediaType="tv" />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Compare TV Shows
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick two TV shows to compare ratings, seasons, episodes, and genres side by side.
      </Typography>
      <ComparePickerForm mediaType="tv" />
      {table}
    </Container>
  );
}
