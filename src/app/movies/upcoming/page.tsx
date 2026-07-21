import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getUpcomingMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Upcoming Movies",
  description: "Upcoming movie releases you can look forward to.",
  alternates: { canonical: "/movies/upcoming" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getUpcomingMovies(Number(page) || 1);
  return (
    <ListingPage
      title="Upcoming Movies"
      description="Upcoming movie releases you can look forward to."
      basePath="/movies/upcoming"
      data={data}
      mediaType="movie"
    />
  );
}
