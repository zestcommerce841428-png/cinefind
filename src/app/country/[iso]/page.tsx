import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getCountries } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ iso: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCountryName(iso: string) {
  const countries = await getCountries();
  return countries.find((c) => c.iso_3166_1 === iso.toUpperCase())?.english_name ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iso } = await params;
  const name = await getCountryName(iso);
  if (!name) return { title: "Country Not Found" };
  return {
    title: `Movies from ${name}`,
    description: `Browse popular movies produced in ${name}.`,
    alternates: { canonical: `/country/${iso}` },
  };
}

export default async function CountryPage({ params, searchParams }: PageProps) {
  const { iso } = await params;
  const { page } = await searchParams;
  const name = await getCountryName(iso);
  if (!name) notFound();

  const data = await discoverMovies({
    with_origin_country: iso.toUpperCase(),
    page: Number(page) || 1,
  });

  return (
    <ListingPage
      title={`Movies from ${name}`}
      description={`Popular movies produced in ${name}, ranked by popularity.`}
      basePath={`/country/${iso}`}
      data={data}
      mediaType="movie"
    />
  );
}
