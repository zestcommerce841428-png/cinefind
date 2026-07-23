import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ComparePickerForm from "@/components/compare/ComparePickerForm";
import MediaCard from "@/components/media/MediaCard";
import ShareButton from "@/components/media/ShareButton";
import { getPersonDetails, getPersonCombinedCredits } from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

type CombinedCredit =
  | (MovieSummary & { media_type: "movie" })
  | (TvSummary & { media_type: "tv" });

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Cast Reunions",
  description: "Find every movie and show where two actors have shared the screen.",
  alternates: { canonical: "/reunions" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ReunionsPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let result: React.ReactNode = null;
  if (a && b) {
    const [personA, personB, creditsA, creditsB] = await Promise.all([
      getPersonDetails(a),
      getPersonDetails(b),
      getPersonCombinedCredits(a),
      getPersonCombinedCredits(b),
    ]);

    const castA = creditsA.cast as CombinedCredit[];
    const castB = creditsB.cast as CombinedCredit[];
    const bIds = new Set(castB.map((c) => `${c.media_type}-${c.id}`));
    const shared = castA
      .filter((c) => bIds.has(`${c.media_type}-${c.id}`))
      .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id && x.media_type === v.media_type) === i)
      .sort((x, y) => y.popularity - x.popularity);

    result = (
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {shared.length > 0
              ? `${personA.name} & ${personB.name} shared the screen ${shared.length} time${shared.length === 1 ? "" : "s"}`
              : `${personA.name} & ${personB.name} haven't appeared together — yet`}
          </Typography>
          <ShareButton title={`${personA.name} & ${personB.name} — Cast Reunions`} text="See every title where they shared the screen." />
        </Box>
        <Grid container spacing={2}>
          {shared.map((credit) => (
            <Grid key={`${credit.media_type}-${credit.id}`} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
              <MediaCard
                id={credit.id}
                title={credit.media_type === "movie" ? credit.title : credit.name}
                subtitle={(credit.media_type === "movie" ? credit.release_date : credit.first_air_date)?.slice(0, 4)}
                posterPath={credit.poster_path}
                voteAverage={credit.vote_average}
                mediaType={credit.media_type}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Cast Reunions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick two actors to see every movie and show where they&apos;ve worked together.
      </Typography>
      <ComparePickerForm kind="person" destPath="/reunions" actionLabel="Find Reunions" />
      {result}
    </Container>
  );
}
