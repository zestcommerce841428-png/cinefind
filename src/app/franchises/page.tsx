import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@/components/common/NextLink";
import { getPopularMovies, getMovieDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: "Franchises & Collections",
  description: "Movie franchises and collections, discovered from what's currently popular.",
  alternates: { canonical: "/franchises" },
};

export default async function FranchisesPage() {
  const [page1, page2] = await Promise.all([getPopularMovies(1), getPopularMovies(2)]);
  const candidates = [...page1.results, ...page2.results].slice(0, 40);

  const details = await Promise.all(candidates.map((m) => getMovieDetails(m.id).catch(() => null)));

  const collections = new Map<number, { id: number; name: string; posterPath: string | null }>();
  for (const detail of details) {
    const collection = detail?.belongs_to_collection;
    if (collection && !collections.has(collection.id)) {
      collections.set(collection.id, {
        id: collection.id,
        name: collection.name,
        posterPath: collection.poster_path,
      });
    }
  }

  const franchises = [...collections.values()];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Franchises &amp; Collections
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Franchises with a currently popular entry — discovered live from TMDB, not a fixed list.
      </Typography>

      {franchises.length === 0 ? (
        <Typography color="text.secondary">No franchises found among today&apos;s popular movies.</Typography>
      ) : (
        <Grid container spacing={2}>
          {franchises.map((f) => {
            const poster = tmdbImage(f.posterPath, "w342");
            return (
              <Grid key={f.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Box
                  component={Link}
                  href={`/collection/${f.id}`}
                  sx={{
                    display: "block",
                    position: "relative",
                    aspectRatio: "2 / 3",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "action.hover",
                  }}
                >
                  {poster && (
                    <Image src={poster} alt={f.name} fill sizes="250px" style={{ objectFit: "cover" }} />
                  )}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "flex-end",
                      p: 1.5,
                      background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#fff", fontWeight: 700 }}>
                      {f.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
