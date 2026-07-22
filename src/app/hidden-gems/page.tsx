import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "@/components/common/NextLink";
import ListingPage from "@/components/discover/ListingPage";
import { discoverMovies } from "@/lib/tmdb";

const DECADES = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"];

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Hidden Gems",
  description: "Highly-rated movies that haven't gone mainstream — great ratings, lower vote counts.",
  alternates: { canonical: "/hidden-gems" },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HiddenGemsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const discoverParams = {
    sort_by: "vote_average.desc",
    "vote_average.gte": 7.5,
    "vote_count.gte": 50,
    "vote_count.lte": 800,
  };
  const data = await discoverMovies({ ...discoverParams, page: Number(page) || 1 });

  return (
    <>
      <ListingPage
        title="Hidden Gems"
        description="Movies rated 7.5+ that most people haven't seen yet — 50 to 800 TMDB votes, so they're real ratings without the blockbuster crowd."
        basePath="/hidden-gems"
        data={data}
        mediaType="movie"
        discoverParams={discoverParams}
      />
      <Container maxWidth="lg" sx={{ pb: 5 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
          Or browse gems by decade
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {DECADES.map((d) => (
            <Chip key={d} label={d} component={Link} href={`/decade/${d}?gems=1`} clickable variant="outlined" />
          ))}
        </Box>
      </Container>
    </>
  );
}
