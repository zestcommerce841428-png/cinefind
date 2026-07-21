import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchProvidersAllRegions from "@/components/detail/WatchProvidersAllRegions";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvWatchProviders } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvWatchProviders(id)]);
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
    title: `Where to Watch ${tv.name}`,
    alternates: { canonical: `/tv/${id}/watch` },
  };
}

export default async function TvWatchPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, providers] = data;

  return <WatchProvidersAllRegions title={tv.name} backHref={`/tv/${id}`} data={providers} />;
}
