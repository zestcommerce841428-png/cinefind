import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getLanguages } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ iso: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getLanguageName(iso: string) {
  const languages = await getLanguages();
  return languages.find((l) => l.iso_639_1 === iso)?.english_name ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iso } = await params;
  const name = await getLanguageName(iso);
  if (!name) return { title: "Language Not Found" };
  return {
    title: `${name} Movies`,
    description: `Browse popular movies originally made in ${name}.`,
    alternates: { canonical: `/language/${iso}` },
  };
}

export default async function LanguagePage({ params, searchParams }: PageProps) {
  const { iso } = await params;
  const { page } = await searchParams;
  const name = await getLanguageName(iso);
  if (!name) notFound();

  const data = await discoverMovies({
    with_original_language: iso,
    page: Number(page) || 1,
  });

  return (
    <ListingPage
      title={`${name} Movies`}
      description={`Popular movies with ${name} as the original language, ranked by popularity.`}
      basePath={`/language/${iso}`}
      data={data}
      mediaType="movie"
    />
  );
}
