import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullReviewsPage from "@/components/detail/FullReviewsPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvReviews } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvReviews(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [tv] = data;
  return { title: `${tv.name} — Reviews`, alternates: { canonical: `/tv/${id}/reviews` } };
}

export default async function TvReviewsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, reviews] = data;

  return <FullReviewsPage title={tv.name} backHref={`/tv/${id}`} reviews={reviews.results} />;
}
