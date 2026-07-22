import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getMovieCertifications } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ country: string; cert: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function isValidCertification(country: string, cert: string) {
  const { certifications } = await getMovieCertifications();
  const list = certifications[country.toUpperCase()];
  return list?.some((c) => c.certification === cert) ?? false;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, cert } = await params;
  const valid = await isValidCertification(country, cert);
  if (!valid) return { title: "Certification Not Found" };
  return {
    title: `${cert} Movies (${country.toUpperCase()})`,
    description: `Movies certified ${cert} in ${country.toUpperCase()}.`,
    alternates: { canonical: `/certification/${country}/${cert}` },
  };
}

export default async function CertificationPage({ params, searchParams }: PageProps) {
  const { country, cert } = await params;
  const { page } = await searchParams;
  const valid = await isValidCertification(country, cert);
  if (!valid) notFound();

  const discoverParams = {
    certification_country: country.toUpperCase(),
    certification: cert,
    "vote_count.gte": 10,
  };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <ListingPage
      title={`${cert} Movies (${country.toUpperCase()})`}
      description={`Movies certified ${cert} in ${country.toUpperCase()}, ranked by popularity.`}
      basePath={`/certification/${country}/${cert}`}
      data={data}
      mediaType="movie"
      discoverParams={discoverParams}
    />
  );
}
