import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Link from "@/components/common/NextLink";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare movies, TV shows, studios, actors, or networks side by side.",
  alternates: { canonical: "/compare" },
};

const OPTIONS = [
  { href: "/compare/movie", emoji: "🎬", label: "Movies", description: "Ratings, budget, revenue, runtime." },
  { href: "/compare/tv", emoji: "📺", label: "TV Shows", description: "Ratings, seasons, episodes, runtime." },
  { href: "/compare/person", emoji: "🎭", label: "Actors", description: "Popularity, filmography size, avg. rating." },
  { href: "/compare/company", emoji: "🏢", label: "Studios", description: "Catalog size, avg. rating, top titles." },
  { href: "/compare/network", emoji: "📡", label: "Networks", description: "Catalog size, avg. rating, top shows." },
];

export default function ComparePage() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Compare
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Pick a category to compare two of anything, side by side.
      </Typography>
      <Grid container spacing={2}>
        {OPTIONS.map((opt) => (
          <Grid key={opt.href} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined">
              <CardActionArea component={Link} href={opt.href} sx={{ p: 1 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 32, mb: 1 }}>{opt.emoji}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {opt.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
