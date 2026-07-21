import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getPopularTv } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Popular TV Shows",
  description: "The most popular TV shows right now.",
  alternates: { canonical: "/tv/popular" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getPopularTv(Number(page) || 1);
  return (
    <ListingPage
      title="Popular TV Shows"
      description="The most popular TV shows right now."
      basePath="/tv/popular"
      data={data}
      mediaType="tv"
    />
  );
}
