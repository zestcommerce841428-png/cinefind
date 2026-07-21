import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Link from "@/components/common/NextLink";

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse popular, top rated, airing today, and on the air TV shows, or use advanced discovery filters.",
  alternates: { canonical: "/tv" },
};

const LINKS = [
  { href: "/tv/discover", label: "Discover TV Shows", desc: "Filter by genre, year, and rating" },
  { href: "/tv/popular", label: "Popular", desc: "Trending with audiences right now" },
  { href: "/tv/top-rated", label: "Top Rated", desc: "Highest rated of all time" },
  { href: "/tv/airing-today", label: "Airing Today", desc: "New episodes airing today" },
  { href: "/tv/on-the-air", label: "On The Air", desc: "Currently in their broadcast run" },
];

export default function TvIndexPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        TV Shows
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
