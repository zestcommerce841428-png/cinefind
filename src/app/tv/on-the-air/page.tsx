import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getOnTheAirTv } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "On The Air",
  description: "TV shows currently in their broadcast run.",
  alternates: { canonical: "/tv/on-the-air" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getOnTheAirTv(Number(page) || 1);
  return (
    <ListingPage
      title="On The Air"
      description="TV shows currently in their broadcast run."
      basePath="/tv/on-the-air"
      data={data}
      mediaType="tv"
    />
  );
}
