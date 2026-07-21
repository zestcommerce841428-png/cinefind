import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullCastPage from "@/components/detail/FullCastPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieCredits } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieCredits(id)]);
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
  return { title: `${movie.title} — Full Cast & Crew`, alternates: { canonical: `/movie/${id}/cast` } };
}

export default async function MovieCastPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, credits] = data;

  return (
    <FullCastPage title={movie.title} backHref={`/movie/${id}`} cast={credits.cast} crew={credits.crew} />
  );
}
