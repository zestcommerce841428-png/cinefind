import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@/components/common/NextLink";
import Image from "next/image";
import { getMovieCredits, getTvCredits } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

type Credit = (MovieSummary | TvSummary) & { media_type: "movie" | "tv" };

export default async function FrequentCoStars({ personId, credits }: { personId: number; credits: Credit[] }) {
  const sample = [...credits].sort((a, b) => b.popularity - a.popularity).slice(0, 15);

  const creditLists = await Promise.all(
    sample.map((c) =>
      (c.media_type === "movie" ? getMovieCredits(c.id) : getTvCredits(c.id)).catch(() => null)
    )
  );

  const coStarCounts = new Map<number, { name: string; profilePath: string | null; count: number }>();
  for (const list of creditLists) {
    if (!list) continue;
    for (const actor of list.cast.slice(0, 10)) {
      if (actor.id === personId) continue;
      const existing = coStarCounts.get(actor.id);
      if (existing) existing.count += 1;
      else coStarCounts.set(actor.id, { name: actor.name, profilePath: actor.profile_path, count: 1 });
    }
  }

  const topCoStars = Array.from(coStarCounts.entries())
    .filter(([, v]) => v.count > 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);

  if (topCoStars.length === 0) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
        Frequent Co-Stars
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Actors who show up again and again across this person&apos;s most popular work.
      </Typography>
      <Grid container spacing={2}>
        {topCoStars.map(([id, actor]) => (
          <Grid key={id} size={{ xs: 4, sm: 3, md: 1.5 }}>
            <Box
              component={Link}
              href={`/person/${id}`}
              sx={{ display: "block", textDecoration: "none", color: "inherit", textAlign: "center" }}
            >
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  overflow: "hidden",
                  bgcolor: "action.hover",
                  mb: 0.75,
                }}
              >
                {actor.profilePath && (
                  <Image
                    src={tmdbImage(actor.profilePath, "w185")!}
                    alt={actor.name}
                    fill
                    sizes="100px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }} noWrap>
                {actor.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {actor.count}× together
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
