import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreIcon from "@mui/icons-material/Explore";
import Link from "@/components/common/NextLink";
import { tmdbImage } from "@/lib/tmdb/config";
import { getTrending } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "CineFind — Find your next watch",
  description:
    "A fast, modern movie and TV discovery app: search, compare, track, and discover across the entire TMDB catalog.",
  alternates: { canonical: "/welcome" },
};

interface Feature {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

const FEATURE_GROUPS: { title: string; features: Feature[] }[] = [
  {
    title: "Discover",
    features: [
      { emoji: "🎭", title: "Browse by Mood", description: "8 curated genre combos for how you want to feel.", href: "/moods" },
      { emoji: "💎", title: "Hidden Gems", description: "Highly-rated titles the crowd hasn't found yet.", href: "/hidden-gems" },
      { emoji: "🌐", title: "Unlimited Genre Filters", description: "Match ALL or ANY of any number of genres at once.", href: "/movies/discover" },
      { emoji: "🗓️", title: "Release Calendar", description: "Upcoming releases with a subscribable .ics feed.", href: "/calendar" },
      { emoji: "🎞️", title: "Franchises & Collections", description: "Live-discovered franchises from what's popular now.", href: "/franchises" },
      { emoji: "📺", title: "New Seasons", description: "Returning shows currently airing past season one.", href: "/new-seasons" },
    ],
  },
  {
    title: "Analyze & Compare",
    features: [
      { emoji: "⚖️", title: "Compare Anything", description: "Movies, TV, actors, studios, or networks — side by side.", href: "/compare" },
      { emoji: "🔗", title: "Six Degrees of Separation", description: "Find how two actors are connected through shared credits.", href: "/six-degrees" },
      { emoji: "💰", title: "Budget vs. Box Office", description: "A visual breakdown of every movie's finances.", href: "/movie/550/finance" },
      { emoji: "📈", title: "Genre Popularity Trends", description: "A live snapshot of what genres are trending right now.", href: "/trends/genres" },
    ],
  },
  {
    title: "Personalize",
    features: [
      { emoji: "🍿", title: "Marathon Planner", description: "Build a lineup and see total runtime + a schedule.", href: "/marathon" },
      { emoji: "⌘", title: "Command Palette", description: "Press ⌘K to search or jump anywhere instantly.", href: "/genres" },
      { emoji: "🎨", title: "70+ Themes & Accessibility", description: "Deep theming plus 20+ real accessibility controls.", href: "/accessibility" },
      { emoji: "📦", title: "Export Everything", description: "Download your favorites, watchlist, and ratings anytime.", href: "/account" },
    ],
  },
];

export default async function WelcomePage() {
  const trending = await getTrending("movie", "day", 1);
  const heroMovies = (trending.results as MovieSummary[]).slice(0, 3);

  return (
    <Box>
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 460, md: 560 } }}>
        <Box sx={{ position: "absolute", inset: 0, display: "flex" }}>
          {heroMovies.map((m) => {
            const backdrop = tmdbImage(m.backdrop_path, "w780");
            return (
              <Box key={m.id} sx={{ position: "relative", flex: 1 }}>
                {backdrop && (
                  <Image src={backdrop} alt="" fill sizes="34vw" style={{ objectFit: "cover" }} priority />
                )}
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--mui-palette-background-default) 10%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.35))",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", pt: { xs: 10, md: 16 }, pb: 8, textAlign: "center" }}>
          <Chip label="Powered by TMDB" size="small" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, fontSize: { xs: 34, md: 56 }, color: "#fff", mb: 2, lineHeight: 1.1 }}
          >
            Find your next watch,
            <br /> not just a search result.
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, mb: 4, maxWidth: 640, mx: "auto" }}>
            Search, compare, track, and discover across the entire movie and TV catalog — with tools
            you won&apos;t find anywhere else.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center", flexWrap: "wrap", rowGap: 2 }}>
            <Button component={Link} href="/" variant="contained" size="large" startIcon={<ExploreIcon />}>
              Start Exploring
            </Button>
            <Button
              component={Link}
              href="/moods"
              variant="outlined"
              size="large"
              color="inherit"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)" }}
              endIcon={<ArrowForwardIcon />}
            >
              Browse by Mood
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {FEATURE_GROUPS.map((group) => (
          <Box key={group.title} sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
              {group.title}
            </Typography>
            <Grid container spacing={2}>
              {group.features.map((f) => (
                <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    component={Link}
                    href={f.href}
                    sx={{
                      display: "block",
                      height: "100%",
                      p: 2.5,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.15s ease, transform 0.15s ease",
                      "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" },
                    }}
                  >
                    <Typography sx={{ fontSize: 28, mb: 1 }}>{f.emoji}</Typography>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {f.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 3,
            borderRadius: 4,
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
            Ready to dive in?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No account required to browse. Sign in with TMDB to sync favorites, watchlist, and ratings.
          </Typography>
          <Button component={Link} href="/" variant="contained" size="large">
            Go to CineFind
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
