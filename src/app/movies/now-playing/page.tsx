import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { getNowPlayingMovies } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Now Playing in Theaters",
  description: "Movies currently playing in theaters.",
  alternates: { canonical: "/movies/now-playing" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const data = await getNowPlayingMovies(Number(page) || 1);
  return (
    <ListingPage
      title="Now Playing in Theaters"
      description="Movies currently playing in theaters."
      basePath="/movies/now-playing"
      data={data}
      mediaType="movie"
    />
  );
}
