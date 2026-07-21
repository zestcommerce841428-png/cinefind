import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getPersonDetails, getPersonImages } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getPersonDetails(id), getPersonImages(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [person] = data;
  return { title: `${person.name} — Photos`, alternates: { canonical: `/person/${id}/images` } };
}

export default async function PersonImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [person, images] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/person/${id}`}>{person.name}</Link>
        <Typography color="text.primary">Photos</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Photos ({images.profiles.length})
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 2,
        }}
      >
        {images.profiles.map((img) => (
          <Box
            key={img.file_path}
            sx={{ position: "relative", aspectRatio: "2 / 3", borderRadius: 2, overflow: "hidden", bgcolor: "action.hover" }}
          >
            <Image
              src={tmdbImage(img.file_path, "w342")!}
              alt={person.name}
              fill
              sizes="200px"
              style={{ objectFit: "cover" }}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
