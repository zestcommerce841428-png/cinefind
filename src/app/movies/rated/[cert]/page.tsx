import type { Metadata } from "next";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ cert: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cert } = await params;
  return {
    title: `Movies Rated ${cert.toUpperCase()}`,
    description: `Browse movies rated ${cert.toUpperCase()} by the MPAA.`,
    alternates: { canonical: `/movies/rated/${cert}` },
  };
}

export default async function MoviesByRatingDetailPage({ params, searchParams }: PageProps) {
  const { cert } = await params;
  const { page } = await searchParams;
  const certification = decodeURIComponent(cert).toUpperCase();

  const data = await discoverMovies({
    page: Number(page) || 1,
    sort_by: "popularity.desc",
    certification,
    certification_country: "US",
    "vote_count.gte": 20,
  });

  return (
    <ListingPage
      title={`Movies Rated ${certification}`}
      description={`Popular movies with a US MPAA rating of ${certification}.`}
      basePath={`/movies/rated/${cert}`}
      data={data}
      mediaType="movie"
    />
  );
}
