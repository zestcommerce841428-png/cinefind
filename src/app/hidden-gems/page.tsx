import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Hidden Gems",
  description: "Highly-rated movies that haven't gone mainstream — great ratings, lower vote counts.",
  alternates: { canonical: "/hidden-gems" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HiddenGemsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const discoverParams = {
    sort_by: "vote_average.desc",
    "vote_average.gte": 7.5,
    "vote_count.gte": 50,
    "vote_count.lte": 800,
  };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title="Hidden Gems"
      description="Movies rated 7.5+ that most people haven't seen yet — 50 to 800 TMDB votes, so they're real ratings without the blockbuster crowd."
      basePath="/hidden-gems"
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
