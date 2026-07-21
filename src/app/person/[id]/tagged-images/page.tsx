import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getPersonDetails, getPersonTaggedImages } from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getPersonDetails(id), getPersonTaggedImages(id)]);
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
  return {
    title: `${person.name} — Tagged Photos`,
    alternates: { canonical: `/person/${id}/tagged-images` },
  };
}

export default async function PersonTaggedImagesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [person, tagged] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/person/${id}`}>{person.name}</Link>
        <Typography color="text.primary">Tagged Photos</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Photos Featuring {person.name}
      </Typography>

      {tagged.results.length === 0 ? (
        <Typography color="text.secondary">No tagged photos available.</Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
          {tagged.results.map((item) => {
            const media = item.media as MovieSummary | TvSummary;
            const mediaTitle =
              (media as MovieSummary).title ?? (media as TvSummary).name ?? person.name;
            return (
              <Box
                key={item.id}
                component={Link}
                href={`/${item.media.media_type ?? "movie"}/${media.id}`}
                sx={{
                  position: "relative",
                  aspectRatio: "16 / 9",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "action.hover",
                  display: "block",
                }}
              >
                <Image
                  src={tmdbImage(item.file_path, "w500")!}
                  alt={mediaTitle}
                  fill
                  sizes="(max-width: 600px) 45vw, 220px"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
