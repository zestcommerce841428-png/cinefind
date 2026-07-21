import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getKeywordDetails, getKeywordMovies } from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";

export const revalidate = 3600;

interface KeywordPageProps {
  params: Promise<{ id: string }>;
}

async function loadKeyword(id: string) {
  try {
    return await Promise.all([getKeywordDetails(id), getKeywordMovies(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: KeywordPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadKeyword(id);
  if (!data) return { title: "Keyword Not Found" };
  const [keyword] = data;
  return {
    title: `Movies tagged "${keyword.name}"`,
    description: `Movies tagged with the keyword "${keyword.name}".`,
    alternates: { canonical: `/keyword/${id}` },
  };
}

export default async function KeywordPage({ params }: KeywordPageProps) {
  const { id } = await params;
  const data = await loadKeyword(id);
  if (!data) notFound();
  const [keyword, movies] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Movies tagged &ldquo;{keyword.name}&rdquo;
      </Typography>
      <MediaGrid items={movies.results} mediaType="movie" />
    </Container>
  );
}
