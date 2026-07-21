import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/detail/ImageGallery";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getNetworkDetails, getNetworkImages } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getNetworkDetails(id), getNetworkImages(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [network] = data;
  return {
    title: `${network.name} — Logos`,
    alternates: { canonical: `/network/${id}/images` },
  };
}

export default async function NetworkImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [network, images] = data;

  return (
    <ImageGallery
      title={network.name}
      backHref={`/network/${id}`}
      backdrops={[]}
      posters={[]}
      logos={images.logos}
    />
  );
}
