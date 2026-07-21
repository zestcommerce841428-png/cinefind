import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getAiringTodayTv } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Airing Today",
  description: "TV shows airing new episodes today.",
  alternates: { canonical: "/tv/airing-today" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getAiringTodayTv(Number(page) || 1);
  return (
    <ListingPage
      title="Airing Today"
      description="TV shows airing new episodes today."
      basePath="/tv/airing-today"
      data={data}
      mediaType="tv"
    />
  );
}
