import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@/components/common/NextLink";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Every major section of CineFind, in one place.",
  alternates: { canonical: "/site-map" },
};

const SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Movies",
    links: [
      { href: "/movies", label: "All Movies" },
      { href: "/movies/discover", label: "Discover" },
      { href: "/movies/popular", label: "Popular" },
      { href: "/movies/top-rated", label: "Top Rated" },
      { href: "/movies/now-playing", label: "Now Playing" },
      { href: "/movies/upcoming", label: "Upcoming" },
      { href: "/movies/short", label: "Short Movies" },
      { href: "/movies/epic", label: "Epic Movies" },
      { href: "/hidden-gems", label: "Hidden Gems" },
      { href: "/random/movie", label: "Random Movie" },
    ],
  },
  {
    title: "TV Shows",
    links: [
      { href: "/tv", label: "All TV Shows" },
      { href: "/tv/discover", label: "Discover" },
      { href: "/tv/popular", label: "Popular" },
      { href: "/tv/top-rated", label: "Top Rated" },
      { href: "/tv/on-the-air", label: "On the Air" },
      { href: "/tv/airing-today", label: "Airing Today" },
      { href: "/new-seasons", label: "New Seasons" },
      { href: "/random/tv", label: "Random TV Show" },
    ],
  },
  {
    title: "Browse",
    links: [
      { href: "/genres", label: "By Genre" },
      { href: "/moods", label: "By Mood" },
      { href: "/decade/2010s", label: "By Decade" },
      { href: "/trending", label: "Trending" },
      { href: "/collections", label: "Collections" },
      { href: "/franchises", label: "Franchises" },
      { href: "/networks", label: "Networks" },
      { href: "/companies", label: "Studios" },
      { href: "/watch-providers", label: "Watch Providers" },
      { href: "/calendar", label: "Release Calendar" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/compare", label: "Compare Anything" },
      { href: "/six-degrees", label: "Six Degrees of Separation" },
      { href: "/marathon", label: "Marathon Planner" },
      { href: "/search/advanced", label: "Advanced Search" },
      { href: "/find", label: "Find by External ID" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My Account" },
      { href: "/account/favorites", label: "Favorites" },
      { href: "/account/watchlist", label: "Watchlist" },
      { href: "/account/rated", label: "Ratings" },
      { href: "/account/lists", label: "Custom Lists" },
    ],
  },
  {
    title: "About & Info",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/changelog", label: "Changelog" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/developers", label: "Developers / API" },
      { href: "/status", label: "System Status" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
    ],
  },
];

export default function SiteMapPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Site Map
      </Typography>
      <Grid container spacing={4}>
        {SECTIONS.map((section) => (
          <Grid key={section.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                {section.title}
              </Typography>
              <Stack spacing={0.75}>
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} style={{ fontSize: 14 }}>
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
