import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullMediaListPage from "@/components/detail/FullMediaListPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieSimilar } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieSimilar(id)]);
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
  return { title: `Movies Similar to ${movie.title}`, alternates: { canonical: `/movie/${id}/similar` } };
}

export default async function MovieSimilarPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, similar] = data;

  return (
    <FullMediaListPage
      title={movie.title}
      backHref={`/movie/${id}`}
      pageLabel="Similar Movies"
      items={similar.results}
      mediaType="movie"
    />
  );
}
