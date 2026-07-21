import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TranslationsPage from "@/components/detail/TranslationsPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieTranslations } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieTranslations(id)]);
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
    title: `${movie.title} — Translations`,
    alternates: { canonical: `/movie/${id}/translations` },
  };
}

export default async function MovieTranslationsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, translations] = data;

  return (
    <TranslationsPage
      title={movie.title}
      backHref={`/movie/${id}`}
      translations={translations.translations}
    />
  );
}
