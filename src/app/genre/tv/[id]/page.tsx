import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverTv, getTvGenres } from "@/lib/tmdb";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getGenreName(id: string) {
  const { genres } = await getTvGenres();
  return genres.find((g) => String(g.id) === id)?.name ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const name = await getGenreName(id);
  if (!name) return { title: "Genre Not Found" };
  return {
    title: `${name} TV Shows`,
    description: `Browse the best ${name} TV shows.`,
    alternates: { canonical: `/genre/tv/${id}` },
  };
}

export default async function GenreTvPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const name = await getGenreName(id);
  if (!name) notFound();

  const data = await discoverTv({ with_genres: id, page: Number(page) || 1 });

  return (
    <ListingPage
      title={`${name} TV Shows`}
      description={`Browse the best ${name} TV shows, ranked by popularity.`}
      basePath={`/genre/tv/${id}`}
      data={data}
      mediaType="tv"
    />
  );
}
