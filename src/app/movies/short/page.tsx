import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Short Movies Under 90 Minutes",
  description: "Popular movies with a runtime of 90 minutes or less — perfect for a quick watch.",
  alternates: { canonical: "/movies/short" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ShortMoviesPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const discoverParams = { "with_runtime.lte": 90, "vote_count.gte": 30 };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title="Short Movies (Under 90 Minutes)"
      description="Popular movies you can finish in an evening — 90 minutes or less."
      basePath="/movies/short"
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
