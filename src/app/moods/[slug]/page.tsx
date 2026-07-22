import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";
import { getMood } from "@/lib/moods";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mood = getMood(slug);
  if (!mood) return { title: "Mood Not Found" };
  return {
    title: `${mood.label} Movies`,
    description: mood.description,
    alternates: { canonical: `/moods/${slug}` },
  };
}

export default async function MoodPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const mood = getMood(slug);
  if (!mood) notFound();

  const discoverParams = {
    with_genres: mood.withGenres,
    sort_by: mood.sortBy ?? "popularity.desc",
    "vote_count.gte": mood.voteCountGte ?? 50,
  };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title={`${mood.emoji} ${mood.label}`}
      description={mood.description}
      basePath={`/moods/${slug}`}
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
