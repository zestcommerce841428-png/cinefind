import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DiscoverFilters from "@/components/discover/DiscoverFilters";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

export const revalidate = 1800;
export const metadata: Metadata = {
  title: "Discover Movies",
  description: "Filter and discover movies by genre, release year, release type, and sort order.",
  alternates: { canonical: "/movies/discover" },
};

interface DiscoverMoviePageProps {
  searchParams: Promise<{
    page?: string;
    sort_by?: string;
    with_genres?: string;
    year?: string;
    with_watch_providers?: string;
    watch_region?: string;
    with_release_type?: string;
  }>;
}

export default async function DiscoverMoviePage({ searchParams }: DiscoverMoviePageProps) {
  const params = await searchParams;
  const discoverParams = {
    sort_by: params.sort_by,
    with_genres: params.with_genres,
    primary_release_year: params.year ? Number(params.year) : undefined,
    with_watch_providers: params.with_watch_providers,
    watch_region: params.with_watch_providers ? (params.watch_region ?? "US") : undefined,
    with_release_type: params.with_release_type,
  };
  const [data, genresData] = await Promise.all([
    discoverMovies({ ...discoverParams, page: Number(params.page) || 1 }),
    getMovieGenres(),
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Discover Movies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Filter thousands of movies by genre, release year, release type, and popularity.
      </Typography>
      <DiscoverFilters basePath="/movies/discover" genres={genresData.genres} showReleaseTypeFilter />
      <ListingPage
        title=""
        basePath="/movies/discover"
        data={data}
        mediaType="movie"
        extraParams={{
          sort_by: params.sort_by,
          with_genres: params.with_genres,
          year: params.year,
          with_watch_providers: params.with_watch_providers,
          watch_region: params.watch_region,
          with_release_type: params.with_release_type,
        }}
        discoverParams={discoverParams}
        bare
      />
    </Container>
  );
}
