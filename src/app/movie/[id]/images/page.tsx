import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/detail/ImageGallery";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieImages } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieImages(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [movie] = data;
  return { title: `${movie.title} — Images`, alternates: { canonical: `/movie/${id}/images` } };
}

export default async function MovieImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, images] = data;

  return (
    <ImageGallery
      title={movie.title}
      backHref={`/movie/${id}`}
      backdrops={images.backdrops}
      posters={images.posters}
      logos={images.logos}
    />
  );
}
