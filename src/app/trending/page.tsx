import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import { getTrending } from "@/lib/tmdb";
import type { TrendingMediaType, TrendingWindow } from "@/lib/tmdb";

export const revalidate = 900;
export const metadata: Metadata = {
  title: "Trending",
  description: "The movies, TV shows, and people trending right now.",
  alternates: { canonical: "/trending" },
};

interface PageProps {
  searchParams: Promise<{ type?: string; window?: string }>;
}

const TYPES: TrendingMediaType[] = ["all", "movie", "tv", "person"];
const WINDOWS: TrendingWindow[] = ["day", "week"];

export default async function TrendingPage({ searchParams }: PageProps) {
  const { type, window } = await searchParams;
  const mediaType: TrendingMediaType = TYPES.includes(type as TrendingMediaType)
    ? (type as TrendingMediaType)
    : "all";
  const trendingWindow: TrendingWindow = WINDOWS.includes(window as TrendingWindow)
    ? (window as TrendingWindow)
    : "day";

  const data = await getTrending(mediaType, trendingWindow);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Trending
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        What&apos;s trending across movies, TV shows, and people right now.
      </Typography>

      <Tabs value={mediaType} sx={{ mb: 1 }}>
        {TYPES.map((t) => (
          <Tab
            key={t}
            value={t}
            label={t === "all" ? "All" : t === "tv" ? "TV Shows" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
            component={Link}
            href={`/trending?type=${t}&window=${trendingWindow}`}
          />
        ))}
      </Tabs>
      <Tabs value={trendingWindow} sx={{ mb: 3 }}>
        {WINDOWS.map((w) => (
          <Tab
            key={w}
            value={w}
            label={w === "day" ? "Today" : "This Week"}
            component={Link}
            href={`/trending?type=${mediaType}&window=${w}`}
          />
        ))}
      </Tabs>

      <MediaGrid items={data.results} />
    </Container>
  );
}
