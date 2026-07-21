import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCollectionDetails } from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";

export const revalidate = 3600;

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

async function loadCollection(id: string) {
  try {
    return await getCollectionDetails(id);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await loadCollection(id);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description: collection.overview || `Every film in the ${collection.name}.`,
    alternates: { canonical: `/collection/${id}` },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = await loadCollection(id);
  if (!collection) notFound();

  const backdrop = tmdbImage(collection.backdrop_path, "original");

  return (
    <>
      <Box sx={{ position: "relative", height: { xs: 220, md: 340 } }}>
        {backdrop && (
          <Image src={backdrop} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: (t) =>
              `linear-gradient(to top, ${t.palette.background.default}, rgba(0,0,0,0.3))`,
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {collection.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 760 }}>
          {collection.overview}
        </Typography>
        <MediaGrid items={collection.parts} mediaType="movie" />
      </Container>
    </>
  );
}
