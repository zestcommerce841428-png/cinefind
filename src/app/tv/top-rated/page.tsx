import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getTopRatedTv } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Top Rated TV Shows",
  description: "The highest-rated TV shows of all time.",
  alternates: { canonical: "/tv/top-rated" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getTopRatedTv(Number(page) || 1);
  return (
    <ListingPage
      title="Top Rated TV Shows"
      description="The highest-rated TV shows of all time."
      basePath="/tv/top-rated"
      data={data}
      mediaType="tv"
    />
  );
}
