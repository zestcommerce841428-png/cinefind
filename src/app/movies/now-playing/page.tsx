import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ListingPage from "@/components/discover/ListingPage";
import RegionPicker from "@/components/discover/RegionPicker";
import { getNowPlayingMovies, getCountries } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Now Playing in Theaters",
  description: "Movies currently playing in theaters, by region.",
  alternates: { canonical: "/movies/now-playing" },
};

interface PageProps {
  searchParams: Promise<{ page?: string; region?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { page, region } = await searchParams;
  const resolvedRegion = region || "US";
  const [data, countries] = await Promise.all([
    getNowPlayingMovies(Number(page) || 1, resolvedRegion),
    getCountries(),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Now Playing in Theaters
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Movies currently playing in theaters, by region.
      </Typography>
      <RegionPicker basePath="/movies/now-playing" countries={countries} value={resolvedRegion} />
      <ListingPage
        title=""
        basePath="/movies/now-playing"
        data={data}
        mediaType="movie"
        extraParams={{ region: resolvedRegion }}
        bare
      />
    </Container>
  );
}
