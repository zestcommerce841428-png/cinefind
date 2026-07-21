import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AlternativeNamesPage from "@/components/detail/AlternativeNamesPage";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCompanyDetails, getCompanyAlternativeNames } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getCompanyDetails(id), getCompanyAlternativeNames(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [company] = data;
  return {
    title: `${company.name} — Alternative Names`,
    alternates: { canonical: `/company/${id}/alternative-names` },
  };
}

export default async function CompanyAlternativeNamesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [company, altNames] = data;

  return (
    <AlternativeNamesPage
      title={company.name}
      backHref={`/company/${id}`}
      names={altNames.results}
    />
  );
}
