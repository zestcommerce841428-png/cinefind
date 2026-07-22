import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PhotoLightboxGrid from "@/components/media/PhotoLightboxGrid";
import { getTrending } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Wallpapers & Photos",
  description: "High-resolution backdrops from this week's trending movies and TV shows.",
  alternates: { canonical: "/photos" },
};

export default async function PhotosPage() {
  const [movies, tv] = await Promise.all([
    getTrending("movie", "week", 1),
    getTrending("tv", "week", 1),
  ]);

  const movieResults = movies.results as MovieSummary[];
  const tvResults = tv.results as TvSummary[];

  const photos = [
    ...movieResults
      .filter((m) => m.backdrop_path)
      .map((m) => ({
        id: m.id,
        title: m.title,
        backdropPath: tmdbImage(m.backdrop_path, "original")!,
        href: `/movie/${m.id}`,
      })),
    ...tvResults
      .filter((t) => t.backdrop_path)
      .map((t) => ({
        id: t.id + 1_000_000,
        title: t.name,
        backdropPath: tmdbImage(t.backdrop_path, "original")!,
        href: `/tv/${t.id}`,
      })),
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Wallpapers &amp; Photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        High-resolution backdrops from this week&apos;s trending movies and TV shows, updated hourly.
      </Typography>
      <PhotoLightboxGrid photos={photos} />
    </Container>
  );
}
