import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { getMovieGenres, getTvGenres } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Browse by Genre",
  description: "Browse movies and TV shows by genre.",
  alternates: { canonical: "/genres" },
};

export default async function GenresPage() {
  const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTvGenres()]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Browse by Genre
      </Typography>

      <Box component="section" sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Movie Genres
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {movieGenres.genres.map((g) => (
            <Chip
              key={g.id}
              component={Link}
              href={`/genre/movie/${g.id}`}
              label={g.name}
              clickable
              sx={{ fontSize: 15, py: 2.5, px: 1 }}
            />
          ))}
        </Box>
      </Box>

      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          TV Genres
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {tvGenres.genres.map((g) => (
            <Chip
              key={g.id}
              component={Link}
              href={`/genre/tv/${g.id}`}
              label={g.name}
              clickable
              sx={{ fontSize: 15, py: 2.5, px: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
