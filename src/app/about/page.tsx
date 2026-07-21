import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "About",
  description: "About CineFind, a fast movie and TV discovery app powered by TMDB.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        About CineFind
      </Typography>
      <Box sx={{ "& > p": { mb: 2, opacity: 0.9 } }}>
        <Typography variant="body1">
          CineFind is a fast, modern movie and TV discovery app built to make finding your next
          watch effortless. Search across movies, TV shows, and people, filter by genre and rating,
          and dive deep into cast, crew, trailers, reviews, and where to stream.
        </Typography>
        <Typography variant="body1">
          All content is powered by{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            The Movie Database (TMDB)
          </a>
          , a community-built movie and TV database. This product uses the TMDB API but is not
          endorsed or certified by TMDB.
        </Typography>
        <Typography variant="body1">
          Sign in with your TMDB account to sync favorites, build a watchlist, and rate what
          you&apos;ve watched — all backed by your real TMDB account.
        </Typography>
      </Box>
    </Container>
  );
}
