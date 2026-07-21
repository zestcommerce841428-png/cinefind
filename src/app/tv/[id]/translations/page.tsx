import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TranslationsPage from "@/components/detail/TranslationsPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvTranslations } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvTranslations(id)]);
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
    title: `${tv.name} — Translations`,
    alternates: { canonical: `/tv/${id}/translations` },
  };
}

export default async function TvTranslationsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, translations] = data;

  return (
    <TranslationsPage
      title={tv.name}
      backHref={`/tv/${id}`}
      translations={translations.translations}
    />
  );
}
