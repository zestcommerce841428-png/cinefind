import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";
import { searchMulti } from "@/lib/tmdb";
import SearchResults from "./SearchResults";
import SearchBox from "./SearchBox";

export const revalidate = 300;

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search",
    description: q
      ? `Movies, TV shows, and people matching "${q}".`
      : "Search for movies, TV shows, and people.",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const pageNum = Number(page) || 1;

  const data = query ? await searchMulti(query, pageNum) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Search
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Find movies, TV shows, and people across the entire TMDB catalog.
      </Typography>

      <Stack direction="row" sx={{ alignItems: "flex-start", gap: 2, flexWrap: "wrap" }}>
        <SearchBox initialQuery={query} />
        <Button component={Link} href="/search/advanced" startIcon={<TuneIcon />} sx={{ mt: 0.5 }}>
          Advanced Search
        </Button>
      </Stack>

      {query && data && (
        <SearchResults
          query={query}
          results={data.results}
          page={data.page}
          totalPages={data.total_pages}
          totalResults={data.total_results}
        />
      )}
    </Container>
  );
}
