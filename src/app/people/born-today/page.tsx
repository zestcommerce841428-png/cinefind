import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MediaCard from "@/components/media/MediaCard";
import ShareButton from "@/components/media/ShareButton";
import { getPopularPeople, getPersonDetails } from "@/lib/tmdb";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: "People Born Today",
  description: "Well-known actors, directors, and crew who share today's birthday.",
  alternates: { canonical: "/people/born-today" },
};

const SAMPLE_PAGES = 10;

export default async function BornTodayPage() {
  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dateLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  const pages = await Promise.all(
    Array.from({ length: SAMPLE_PAGES }, (_, i) => getPopularPeople(i + 1).catch(() => null))
  );
  const candidates = pages.flatMap((p) => p?.results ?? []);
  const uniqueCandidates = Array.from(new Map(candidates.map((p) => [p.id, p])).values());

  const details = await Promise.all(
    uniqueCandidates.map((p) => getPersonDetails(p.id).catch(() => null))
  );

  const bornToday = details
    .filter((p): p is NonNullable<typeof p> => p !== null && !!p.birthday && !p.deathday)
    .filter((p) => p.birthday!.slice(5) === monthDay)
    .sort((a, b) => b.popularity - a.popularity);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          People Born Today — {dateLabel}
        </Typography>
        <ShareButton title="People Born Today — CineFind" text={`Well-known people born on ${dateLabel}.`} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Searched among today&apos;s {uniqueCandidates.length} most popular actors, directors, and crew
        on TMDB.
      </Typography>

      {bornToday.length === 0 ? (
        <Typography color="text.secondary">
          None of today&apos;s most popular people share this birthday — check back tomorrow.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {bornToday.map((p) => {
            const age = today.getFullYear() - Number(p.birthday!.slice(0, 4));
            return (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                <MediaCard
                  id={p.id}
                  title={p.name}
                  subtitle={`Turns ${age} today`}
                  posterPath={p.profile_path}
                  mediaType="person"
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
