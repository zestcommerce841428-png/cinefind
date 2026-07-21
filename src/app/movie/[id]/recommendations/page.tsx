import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullMediaListPage from "@/components/detail/FullMediaListPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieRecommendations } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieRecommendations(id)]);
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
    title: `Recommended If You Liked ${movie.title}`,
    alternates: { canonical: `/movie/${id}/recommendations` },
  };
}

export default async function MovieRecommendationsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, recommendations] = data;

  return (
    <FullMediaListPage
      title={movie.title}
      backHref={`/movie/${id}`}
      pageLabel="Recommended For You"
      items={recommendations.results}
      mediaType="movie"
    />
  );
}
