import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getGenreName(id: string) {
  const { genres } = await getMovieGenres();
  return genres.find((g) => String(g.id) === id)?.name ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const name = await getGenreName(id);
  if (!name) return { title: "Genre Not Found" };
  return {
    title: `${name} Movies`,
    description: `Browse the best ${name} movies.`,
    alternates: { canonical: `/genre/movie/${id}` },
  };
}

export default async function GenreMoviePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const name = await getGenreName(id);
  if (!name) notFound();

  const data = await discoverMovies({ with_genres: id, page: Number(page) || 1 });

  return (
    <ListingPage
      title={`${name} Movies`}
      description={`Browse the best ${name} movies, ranked by popularity.`}
      basePath={`/genre/movie/${id}`}
      data={data}
      mediaType="movie"
      discoverParams={{ with_genres: id }}
    />
  );
}
