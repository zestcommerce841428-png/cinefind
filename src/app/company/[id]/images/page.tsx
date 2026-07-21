import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/detail/ImageGallery";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCompanyDetails, getCompanyImages } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getCompanyDetails(id), getCompanyImages(id)]);
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
    title: `${company.name} — Logos`,
    alternates: { canonical: `/company/${id}/images` },
  };
}

export default async function CompanyImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [company, images] = data;

  return (
    <ImageGallery
      title={company.name}
      backHref={`/company/${id}`}
      backdrops={[]}
      posters={[]}
      logos={images.logos}
    />
  );
}
