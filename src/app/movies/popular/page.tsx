import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getPopularMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Popular Movies",
  description: "Browse the most popular movies right now, ranked by audience popularity.",
  alternates: { canonical: "/movies/popular" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getPopularMovies(Number(page) || 1);
  return (
    <ListingPage
      title="Popular Movies"
      description="The most popular movies right now, based on real-time audience activity."
      basePath="/movies/popular"
      data={data}
      mediaType="movie"
    />
  );
}
