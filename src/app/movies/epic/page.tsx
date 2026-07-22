import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Epic Movies Over 2.5 Hours",
  description: "Popular movies with a runtime of 150 minutes or more — settle in for the long haul.",
  alternates: { canonical: "/movies/epic" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function EpicMoviesPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const discoverParams = { "with_runtime.gte": 150, "vote_count.gte": 30 };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title="Epic Movies (2.5 Hours+)"
      description="Popular movies with a runtime of 150 minutes or more."
      basePath="/movies/epic"
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
