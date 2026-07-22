import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DuelBracket from "@/components/duel/DuelBracket";
import { getTrending } from "@/lib/tmdb";
import type { MovieSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Movie Duel",
  description: "Can't decide what to watch? Pick a winner between two movies until only one remains.",
  alternates: { canonical: "/duel" },
};

export default async function DuelPage() {
  const trending = await getTrending("movie", "week");
  const pool = (trending.results as MovieSummary[]).filter((m) => m.poster_path).slice(0, 16);

  return (
    <Container maxWidth="md" sx={{ py: 5, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Movie Duel
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Sixteen movies enter, one leaves. Pick a winner each round until you have tonight&apos;s watch.
      </Typography>
      <DuelBracket pool={pool} />
    </Container>
  );
}
