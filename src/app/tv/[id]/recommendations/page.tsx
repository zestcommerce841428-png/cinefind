import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullMediaListPage from "@/components/detail/FullMediaListPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvRecommendations } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvRecommendations(id)]);
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
  return {
    title: `Recommended If You Liked ${tv.name}`,
    alternates: { canonical: `/tv/${id}/recommendations` },
  };
}

export default async function TvRecommendationsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, recommendations] = data;

  return (
    <FullMediaListPage
      title={tv.name}
      backHref={`/tv/${id}`}
      pageLabel="Recommended For You"
      items={recommendations.results}
      mediaType="tv"
    />
  );
}
