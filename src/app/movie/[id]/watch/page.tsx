import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchProvidersAllRegions from "@/components/detail/WatchProvidersAllRegions";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieWatchProviders } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieWatchProviders(id)]);
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
    title: `Where to Watch ${movie.title}`,
    alternates: { canonical: `/movie/${id}/watch` },
  };
}

export default async function MovieWatchPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, providers] = data;

  return (
    <WatchProvidersAllRegions title={movie.title} backHref={`/movie/${id}`} data={providers} />
  );
}
