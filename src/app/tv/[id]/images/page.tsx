import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/detail/ImageGallery";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvImages } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvImages(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [tv] = data;
  return { title: `${tv.name} — Images`, alternates: { canonical: `/tv/${id}/images` } };
}

export default async function TvImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, images] = data;

  return (
    <ImageGallery
      title={tv.name}
      backHref={`/tv/${id}`}
      backdrops={images.backdrops}
      posters={images.posters}
      logos={images.logos}
    />
  );
}
