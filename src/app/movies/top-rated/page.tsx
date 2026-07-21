import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getTopRatedMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Top Rated Movies",
  description: "The highest-rated movies of all time, ranked by audience score.",
  alternates: { canonical: "/movies/top-rated" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getTopRatedMovies(Number(page) || 1);
  return (
    <ListingPage
      title="Top Rated Movies"
      description="The highest-rated movies of all time, ranked by audience score."
      basePath="/movies/top-rated"
      data={data}
      mediaType="movie"
    />
  );
}
