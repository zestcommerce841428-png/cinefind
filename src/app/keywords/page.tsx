import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@/components/common/NextLink";
import KeywordSearchBox from "@/components/keywords/KeywordSearchBox";
import ShareButton from "@/components/media/ShareButton";
import { getTrending, getMovieKeywords } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/tmdb/types";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: "Keywords Explorer",
  description: "Search any TMDB keyword tag, or browse what's trending across this week's popular movies.",
  alternates: { canonical: "/keywords" },
};

export default async function KeywordsExplorerPage() {
  const trending = await getTrending("movie", "week");
  const sample = (trending.results as MovieSummary[]).slice(0, 15);

  const keywordLists = await Promise.all(sample.map((m) => getMovieKeywords(m.id).catch(() => null)));

  const counts = new Map<number, { name: string; count: number }>();
  for (const list of keywordLists) {
    if (!list) continue;
    for (const kw of list.keywords ?? []) {
      const existing = counts.get(kw.id);
      if (existing) existing.count += 1;
      else counts.set(kw.id, { name: kw.name, count: 1 });
    }
  }

  const topKeywords = Array.from(counts.entries())
    .filter(([, v]) => v.count > 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 40);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Keywords Explorer
        </Typography>
        <ShareButton title="Keywords Explorer — CineFind" text="Search any theme or plot tag." />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Every movie is tagged with themes and plot elements. Search any keyword, or see what&apos;s
        trending this week.
      </Typography>

      <Box sx={{ mb: 5 }}>
        <KeywordSearchBox />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Trending Keywords This Week
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {topKeywords.map(([id, kw]) => (
          <Chip
            key={id}
            component={Link}
            href={`/keyword/${id}`}
            clickable
            label={`${kw.name} · ${kw.count}`}
            variant="outlined"
          />
        ))}
      </Box>
    </Container>
  );
}
