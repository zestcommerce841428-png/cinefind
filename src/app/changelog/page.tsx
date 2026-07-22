import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in CineFind.",
  alternates: { canonical: "/changelog" },
};

interface Entry {
  version: string;
  title: string;
  items: string[];
}

const ENTRIES: Entry[] = [
  {
    version: "1.4",
    title: "Unlimited genres, play buttons, and 20+ discovery tools",
    items: [
      "Match ALL or ANY of an unlimited number of genres when discovering movies or TV shows",
      "Centered trailer play buttons on hero and detail page backdrops",
      "Infinite-scroll \"Load more\" on decade, language, country, genre, and discover pages",
      "Hidden Gems, Short Movies, Epic Movies, 8 curated Mood boards, and a Marathon Planner",
      "Full-account JSON backup and a keyboard-shortcuts cheat sheet (press \"?\")",
    ],
  },
  {
    version: "1.3",
    title: "Browse by decade, language, and country",
    items: [
      "New /decade, /language, and /country listing pages",
      "Release calendar with a subscribable .ics feed",
      "Movie budget vs. box-office chart, TV translations page, Studio Showdown compare",
      "CSV/JSON export for favorites, watchlist, and ratings",
      "Six Degrees of Separation actor connection finder",
      "Global Cmd+K command palette",
      "Genre fingerprint and career-timeline charts on person pages",
      "Local watch-history heatmap and \"You Might Also Like\" recommendations",
    ],
  },
  {
    version: "1.2",
    title: "Production hardening",
    items: [
      "Security headers (CSP, HSTS, Permissions-Policy) and CSRF protection",
      "Per-route rate limiting and Zod-validated API input",
      "/api/health endpoint, Docker healthcheck, and CI pipeline",
      "Dynamic Open Graph images and on-demand ISR revalidation",
    ],
  },
  {
    version: "1.1",
    title: "Themes & accessibility",
    items: [
      "70+ theme presets across 8 style categories",
      "Unified Accessibility & Style Panel with 20+ real accessibility controls",
      "Global scroll-to-top/bottom control",
    ],
  },
  {
    version: "1.0",
    title: "Initial release",
    items: [
      "Search and browse movies, TV shows, and people via the TMDB API",
      "Detail pages with cast, crew, videos, reviews, and watch providers",
      "TMDB account sign-in with favorites, watchlist, and ratings sync",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Changelog
      </Typography>
      <Stack spacing={4}>
        {ENTRIES.map((entry) => (
          <Box key={entry.version}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
              <Chip label={`v${entry.version}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {entry.title}
              </Typography>
            </Stack>
            <Stack component="ul" spacing={0.5} sx={{ pl: 3, m: 0 }}>
              {entry.items.map((item) => (
                <Typography key={item} component="li" variant="body2" color="text.secondary">
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
