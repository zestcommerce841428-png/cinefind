import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ decade: string }>;
  searchParams: Promise<{ page?: string }>;
}

function parseDecade(decade: string) {
  const match = /^(\d{4})s$/.exec(decade);
  if (!match) return null;
  const start = Number(match[1]);
  if (start < 1900 || start % 10 !== 0 || start > new Date().getFullYear()) return null;
  return start;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { decade } = await params;
  const start = parseDecade(decade);
  if (start === null) return { title: "Decade Not Found" };
  return {
    title: `${decade} Movies`,
    description: `Browse the most popular movies released in the ${decade}.`,
    alternates: { canonical: `/decade/${decade}` },
  };
}

export default async function DecadePage({ params, searchParams }: PageProps) {
  const { decade } = await params;
  const { page } = await searchParams;
  const start = parseDecade(decade);
  if (start === null) notFound();

  const data = await discoverMovies({
    "primary_release_date.gte": `${start}-01-01`,
    "primary_release_date.lte": `${start + 9}-12-31`,
    "vote_count.gte": 20,
    page: Number(page) || 1,
  });

  return (
    <ListingPage
      title={`${decade} Movies`}
      description={`The most popular movies released between ${start} and ${start + 9}.`}
      basePath={`/decade/${decade}`}
      data={data}
      mediaType="movie"
    />
  );
}
