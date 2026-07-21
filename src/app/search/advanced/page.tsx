import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AdvancedSearchForm from "./AdvancedSearchForm";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies, getMovieGenres } from "@/lib/tmdb";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Advanced Search",
  description: "Fine-tune your movie search with genre, year range, rating, runtime, and language filters.",
  alternates: { canonical: "/search/advanced" },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    with_genres?: string;
    year_from?: string;
    year_to?: string;
    rating_min?: string;
    runtime_min?: string;
    runtime_max?: string;
    language?: string;
    sort_by?: string;
  }>;
}

export default async function AdvancedSearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const genresData = await getMovieGenres();

  const hasFilters = Object.values(params).some(Boolean);
  const data = hasFilters
    ? await discoverMovies({
        page: Number(params.page) || 1,
        with_genres: params.with_genres,
        "primary_release_date.gte": params.year_from ? `${params.year_from}-01-01` : undefined,
        "primary_release_date.lte": params.year_to ? `${params.year_to}-12-31` : undefined,
        "vote_average.gte": params.rating_min ? Number(params.rating_min) : undefined,
        with_runtime_gte: params.runtime_min ? Number(params.runtime_min) : undefined,
        with_runtime_lte: params.runtime_max ? Number(params.runtime_max) : undefined,
        with_original_language: params.language,
        sort_by: params.sort_by || "popularity.desc",
        "vote_count.gte": 50,
      })
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Advanced Search
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fine-tune your search with genre, release year range, minimum rating, runtime, and
        original language filters.
      </Typography>

      <AdvancedSearchForm genres={genresData.genres} />

      {data && (
        <ListingPage
          title=""
          basePath="/search/advanced"
          data={data}
          mediaType="movie"
          extraParams={params}
          bare
        />
      )}
    </Container>
  );
}
