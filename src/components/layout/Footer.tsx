import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Stack from "@mui/material/Stack";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/discover", label: "Discover Feed" },
      { href: "/movies", label: "Movies" },
      { href: "/tv", label: "TV Shows" },
      { href: "/people", label: "People" },
      { href: "/collections", label: "Collections" },
      { href: "/companies", label: "Companies" },
      { href: "/networks", label: "TV Networks" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/movies/discover", label: "Discover Movies" },
      { href: "/tv/discover", label: "Discover TV" },
      { href: "/genres", label: "Genres" },
      { href: "/moods", label: "Browse by Mood" },
      { href: "/hidden-gems", label: "Hidden Gems" },
      { href: "/franchises", label: "Franchises" },
      { href: "/trending", label: "Trending" },
      { href: "/new-releases", label: "New Releases" },
      { href: "/new-seasons", label: "New Seasons" },
      { href: "/movies/rated", label: "Browse by Rating" },
      { href: "/movies/new-on-digital", label: "New on Digital" },
      { href: "/photos", label: "Wallpapers & Photos" },
      { href: "/clips", label: "Trailers & Clips" },
      { href: "/watch-providers", label: "Streaming Providers" },
      { href: "/compare", label: "Compare Anything" },
      { href: "/six-degrees", label: "Six Degrees of Separation" },
      { href: "/marathon", label: "Marathon Planner" },
      { href: "/watch-party", label: "Watch Party Picker" },
      { href: "/duel", label: "Movie Duel" },
      { href: "/box-office", label: "Box Office Leaderboard" },
      { href: "/reunions", label: "Cast Reunions" },
      { href: "/insights/runtime", label: "Runtime Explorer" },
      { href: "/keywords", label: "Keywords Explorer" },
      { href: "/calendar", label: "Release Calendar" },
      { href: "/find", label: "Find by IMDb ID" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/account/taste-profile", label: "Taste Profile" },
      { href: "/reference/languages", label: "Languages" },
      { href: "/reference/countries", label: "Countries" },
      { href: "/reference/certifications", label: "Content Ratings" },
      { href: "/trends/genres", label: "Genre Popularity Trends" },
      { href: "/random/movie", label: "Random Movie" },
      { href: "/random/tv", label: "Random Show" },
      { href: "/site-map", label: "Site Map" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/changelog", label: "Changelog" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/developers", label: "Developers" },
      { href: "/status", label: "System Status" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: 8, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                {col.title}
              </Typography>
              <Stack spacing={0.75}>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ textDecoration: "none", color: "inherit", opacity: 0.75, fontSize: 14 }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
              CineFind
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="caption" sx={{ display: "block", mt: 4, opacity: 0.5 }}>
          © {new Date().getFullYear()} CineFind. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
