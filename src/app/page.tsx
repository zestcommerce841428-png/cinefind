import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExploreIcon from "@mui/icons-material/Explore";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Link from "@/components/common/NextLink";
import SearchBox from "@/app/search/SearchBox";
import MediaRow from "@/components/media/MediaRow";
import { tmdbImage } from "@/lib/tmdb/config";
import { getTrending, getMovieGenres, getTvGenres, getCountries, getLanguages } from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "CineFind — Find your next watch",
  description:
    "A fast, modern movie and TV discovery app: search, compare, track, and discover across the entire TMDB catalog.",
  alternates: { canonical: "/" },
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
      { emoji: "🎭", title: "Browse by Mood", description: "47 curated genre combos for how you want to feel.", href: "/moods" },
      { emoji: "💎", title: "Hidden Gems", description: "Highly-rated titles the crowd hasn't found yet.", href: "/hidden-gems" },
      { emoji: "🌐", title: "Unlimited Genre Filters", description: "Match ALL or ANY of any number of genres at once.", href: "/movies/discover" },
      { emoji: "🗓️", title: "Release Calendar", description: "Upcoming releases with a subscribable .ics feed.", href: "/calendar" },
      { emoji: "🎞️", title: "Franchises & Collections", description: "Live-discovered franchises from what's popular now.", href: "/franchises" },
      { emoji: "🔑", title: "Keywords Explorer", description: "Search any theme or plot tag across the whole catalog.", href: "/keywords" },
    ],
  },
  {
    title: "Analyze & Compare",
    features: [
      { emoji: "⚖️", title: "Compare Anything", description: "Movies, TV, actors, studios, or networks — side by side.", href: "/compare" },
      { emoji: "🔗", title: "Six Degrees of Separation", description: "Find how two actors are connected through shared credits.", href: "/six-degrees" },
      { emoji: "💰", title: "Box Office Leaderboard", description: "Real budget vs. revenue, sortable by ROI.", href: "/box-office" },
      { emoji: "📈", title: "Genre Popularity Trends", description: "A live snapshot of what genres are trending right now.", href: "/trends/genres" },
      { emoji: "⏱️", title: "Runtime Explorer", description: "Average runtime by genre, from real sampled data.", href: "/insights/runtime" },
      { emoji: "🎭", title: "Cast Reunions", description: "Find every title where two actors shared the screen.", href: "/reunions" },
    ],
  },
  {
    title: "Personalize",
    features: [
      { emoji: "❤️", title: "Favorite & Rate Anything", description: "Like, watchlist, and rate movies and TV shows alike — synced to your account.", href: "/tv/popular" },
      { emoji: "🧭", title: "Your Taste Profile", description: "Genre, decade, and actor breakdown of what you actually watch.", href: "/account/taste-profile" },
      { emoji: "🍿", title: "Marathon Planner", description: "Build a lineup, print it, or export it to your calendar.", href: "/marathon" },
      { emoji: "🎬", title: "Movie Duel", description: "Single-elimination bracket picker for indecisive nights.", href: "/duel" },
      { emoji: "⌘", title: "Command Palette", description: "Press ⌘K to search or jump anywhere instantly.", href: "/genres" },
      { emoji: "📦", title: "Export Everything", description: "Download your favorites, watchlist, and ratings anytime.", href: "/account" },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    icon: <TravelExploreIcon />,
    title: "Discover",
    description: "Filter by unlimited genres, mood, decade, provider, or keyword — no caps, no paywalls.",
  },
  {
    icon: <CompareArrowsIcon />,
    title: "Analyze & Compare",
    description: "Put two movies, actors, or studios side by side, or trace how any two people are connected.",
  },
  {
    icon: <BookmarkBorderIcon />,
    title: "Track & Personalize",
    description: "Favorite, rate, and build watch lists that sync to your TMDB account across devices.",
  },
];

export default async function HomePage() {
  const [trendingMovies, trendingTv, movieGenres, tvGenres, countries, languages] = await Promise.all([
    getTrending("movie", "day", 1),
    getTrending("tv", "day", 1),
    getMovieGenres(),
    getTvGenres(),
    getCountries(),
    getLanguages(),
  ]);

  const heroMovies = (trendingMovies.results as MovieSummary[]).slice(0, 3);
  const uniqueGenreCount = new Set([
    ...movieGenres.genres.map((g) => g.name),
    ...tvGenres.genres.map((g) => g.name),
  ]).size;

  const stats = [
    { value: `${countries.length}+`, label: "Countries Covered" },
    { value: `${languages.length}+`, label: "Languages Supported" },
    { value: `${uniqueGenreCount}`, label: "Genres to Mix & Match" },
    { value: "60+", label: "Tools & Pages" },
  ];

  return (
    <Box>
      <Box sx={{ position: "relative", overflow: "hidden", minHeight: { xs: 520, md: 620 } }}>
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
              "linear-gradient(to top, var(--mui-palette-background-default) 12%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.4))",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", pt: { xs: 10, md: 16 }, pb: 8, textAlign: "center" }}>
          <Chip label="Powered by the TMDB API" size="small" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
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

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box sx={{ width: "100%", maxWidth: 520 }}>
              <SearchBox initialQuery="" placeholder="Search any movie, show, or actor…" />
            </Box>
          </Box>

          <Stack direction="row" spacing={2} sx={{ justifyContent: "center", flexWrap: "wrap", rowGap: 2 }}>
            <Button component={Link} href="/discover" variant="contained" size="large" startIcon={<ExploreIcon />}>
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

      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Grid container spacing={2}>
          {stats.map((s) => (
            <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <MediaRow title="Trending Movies Today" items={trendingMovies.results as MovieSummary[]} mediaType="movie" seeAllHref="/trending" />
        <MediaRow title="Trending TV Shows Today" items={trendingTv.results as TvSummary[]} mediaType="tv" seeAllHref="/trending" />
      </Container>

      <Box sx={{ bgcolor: "action.hover", py: 7 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, textAlign: "center" }}>
            How CineFind Works
          </Typography>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((step, i) => (
              <Grid key={step.title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "secondary.main",
                      color: "secondary.contrastText",
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography variant="overline" color="text.secondary">
                    Step {i + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: "auto" }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
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
                      transition: "border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "action.selected", color: "text.primary", mb: 1.5, width: 44, height: 44 }}>
                      <Typography sx={{ fontSize: 22 }}>{f.emoji}</Typography>
                    </Avatar>
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
          <Button component={Link} href="/discover" variant="contained" size="large">
            Go to CineFind
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
