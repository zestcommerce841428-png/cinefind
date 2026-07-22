import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@/components/common/NextLink";
import TrailerPlayButton from "@/components/media/TrailerPlayButton";
import { getTrending } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Trailers & Clips",
  description: "Watch trailers and clips from this week's trending movies, all in one place.",
  alternates: { canonical: "/clips" },
};

export default async function ClipsPage() {
  const trending = await getTrending("movie", "week", 1);
  const movies = (trending.results as MovieSummary[]).filter((m) => m.backdrop_path);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Trailers &amp; Clips
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Trailers from this week&apos;s trending movies. Click play to watch inline.
      </Typography>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "16 / 9",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "action.hover",
              }}
            >
              <Image
                src={tmdbImage(movie.backdrop_path, "w780")!}
                alt={movie.title}
                fill
                sizes="380px"
                style={{ objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.25)",
                }}
              >
                <TrailerPlayButton mediaType="movie" mediaId={movie.id} size={56} />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                }}
              >
                <Typography
                  component={Link}
                  href={`/movie/${movie.id}`}
                  variant="body2"
                  sx={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}
                  noWrap
                >
                  {movie.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
