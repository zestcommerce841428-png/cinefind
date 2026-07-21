import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullMediaListPage from "@/components/detail/FullMediaListPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvSimilar } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvSimilar(id)]);
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
  return { title: `Shows Similar to ${tv.name}`, alternates: { canonical: `/tv/${id}/similar` } };
}

export default async function TvSimilarPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, similar] = data;

  return (
    <FullMediaListPage
      title={tv.name}
      backHref={`/tv/${id}`}
      pageLabel="Similar Shows"
      items={similar.results}
      mediaType="tv"
    />
  );
}
