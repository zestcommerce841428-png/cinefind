import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DiscoverFilters from "@/components/discover/DiscoverFilters";
import ListingPage from "@/components/discover/ListingPage";
import { discoverTv, getTvGenres } from "@/lib/tmdb";

export const revalidate = 1800;
export const metadata: Metadata = {
  title: "Discover TV Shows",
  description: "Filter and discover TV shows by genre, first air date year, and sort order.",
  alternates: { canonical: "/tv/discover" },
};

interface DiscoverTvPageProps {
  searchParams: Promise<{
    page?: string;
    sort_by?: string;
    with_genres?: string;
    year?: string;
    with_watch_providers?: string;
    watch_region?: string;
  }>;
}

export default async function DiscoverTvPage({ searchParams }: DiscoverTvPageProps) {
  const params = await searchParams;
  const discoverParams = {
    sort_by: params.sort_by,
    with_genres: params.with_genres,
    first_air_date_year: params.year ? Number(params.year) : undefined,
    with_watch_providers: params.with_watch_providers,
    watch_region: params.with_watch_providers ? (params.watch_region ?? "US") : undefined,
  };
  const [data, genresData] = await Promise.all([
    discoverTv({ ...discoverParams, page: Number(params.page) || 1 }),
    getTvGenres(),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Discover TV Shows
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Filter thousands of TV shows by genre, first air date, and popularity.
      </Typography>
      <DiscoverFilters basePath="/tv/discover" genres={genresData.genres} />
      <ListingPage
        title=""
        basePath="/tv/discover"
        data={data}
        mediaType="tv"
        extraParams={{
          sort_by: params.sort_by,
          with_genres: params.with_genres,
          year: params.year,
          with_watch_providers: params.with_watch_providers,
          watch_region: params.watch_region,
        }}
        discoverParams={discoverParams}
        bare
      />
    </Container>
  );
}
