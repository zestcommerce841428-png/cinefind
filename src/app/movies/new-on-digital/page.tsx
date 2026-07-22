import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "New on Digital",
  description: "Movies recently released digitally (rent or buy), newest first.",
  alternates: { canonical: "/movies/new-on-digital" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewOnDigitalPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const discoverParams = {
    with_release_type: "4",
    sort_by: "primary_release_date.desc",
    "primary_release_date.lte": today,
    "vote_count.gte": 5,
  };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title="New on Digital"
      description="Movies recently released digitally (rent or buy), newest first."
      basePath="/movies/new-on-digital"
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
