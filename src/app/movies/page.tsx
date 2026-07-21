import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Link from "@/components/common/NextLink";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse popular, top rated, now playing, and upcoming movies, or use advanced discovery filters.",
  alternates: { canonical: "/movies" },
};

const LINKS = [
  { href: "/movies/discover", label: "Discover Movies", desc: "Filter by genre, year, and rating" },
  { href: "/movies/popular", label: "Popular", desc: "Trending with audiences right now" },
  { href: "/movies/top-rated", label: "Top Rated", desc: "Highest rated of all time" },
  { href: "/movies/now-playing", label: "Now Playing", desc: "Currently in theaters" },
  { href: "/movies/upcoming", label: "Upcoming", desc: "Coming soon to theaters" },
];

export default function MoviesIndexPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Movies
      </Typography>
      <Grid container spacing={2}>
        {LINKS.map((link) => (
          <Grid key={link.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              href={link.href}
              elevation={0}
              sx={{
                display: "block",
                p: 3,
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {link.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {link.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
