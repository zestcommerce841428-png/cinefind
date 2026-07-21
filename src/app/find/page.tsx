import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MediaGrid from "@/components/media/MediaGrid";
import { findByExternalId } from "@/lib/tmdb";
import FindForm from "./FindForm";

export const metadata: Metadata = {
  title: "Find by External ID",
  description: "Look up a movie, TV show, or person on TMDB using an IMDb ID or other external identifier.",
  alternates: { canonical: "/find" },
};

interface PageProps {
  searchParams: Promise<{ id?: string; source?: string }>;
}

export default async function FindPage({ searchParams }: PageProps) {
  const { id, source } = await searchParams;
  const externalId = id?.trim();

  const results = externalId
    ? await findByExternalId(
        externalId,
        (source as Parameters<typeof findByExternalId>[1]) ?? "imdb_id"
      )
    : null;

  const combined = results
    ? [...results.movie_results, ...results.tv_results, ...results.person_results]
    : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Find by External ID
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Paste an IMDb ID (e.g. tt0111161) or other supported external identifier to jump straight
        to its TMDB page.
      </Typography>

      <FindForm initialId={externalId ?? ""} initialSource={source ?? "imdb_id"} />

      {externalId && (
        <Box sx={{ mt: 4 }}>
          {combined.length === 0 ? (
            <Typography color="text.secondary">No match found for &ldquo;{externalId}&rdquo;.</Typography>
          ) : (
            <MediaGrid items={combined} />
          )}
        </Box>
      )}
    </Container>
  );
}
