import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FullCastPage from "@/components/detail/FullCastPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvCredits } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvCredits(id)]);
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
  return { title: `${tv.name} — Full Cast & Crew`, alternates: { canonical: `/tv/${id}/cast` } };
}

export default async function TvCastPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, credits] = data;

  return <FullCastPage title={tv.name} backHref={`/tv/${id}`} cast={credits.cast} crew={credits.crew} />;
}
