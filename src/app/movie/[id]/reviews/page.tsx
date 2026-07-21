import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullReviewsPage from "@/components/detail/FullReviewsPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieReviews } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieReviews(id)]);
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
  return { title: `${movie.title} — Reviews`, alternates: { canonical: `/movie/${id}/reviews` } };
}

export default async function MovieReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, reviews] = data;

  return <FullReviewsPage title={movie.title} backHref={`/movie/${id}`} reviews={reviews.results} />;
}
