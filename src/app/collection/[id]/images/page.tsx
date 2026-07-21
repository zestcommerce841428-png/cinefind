import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/detail/ImageGallery";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCollectionDetails, getCollectionImages } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getCollectionDetails(id), getCollectionImages(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [collection] = data;
  return {
    title: `${collection.name} — Images`,
    alternates: { canonical: `/collection/${id}/images` },
  };
}

export default async function CollectionImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [collection, images] = data;

  return (
    <ImageGallery
      title={collection.name}
      backHref={`/collection/${id}`}
      backdrops={images.backdrops}
      posters={images.posters}
    />
  );
}
