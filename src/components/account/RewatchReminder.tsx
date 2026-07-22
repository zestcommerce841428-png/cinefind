"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MediaCard from "@/components/media/MediaCard";
import { subscribeRecentlyViewed, getRecentlyViewedSnapshot, getRecentlyViewedServerSnapshot } from "@/lib/recentlyViewed";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

interface RatedItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  voteAverage: number;
  rating: number;
}

export default function RewatchReminder({ ratedMovies, ratedTv }: { ratedMovies: MovieSummary[]; ratedTv: TvSummary[] }) {
  const recentlyViewed = React.useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  );

  const highlyRated: RatedItem[] = [
    ...ratedMovies
      .filter((m) => ((m as MovieSummary & { rating?: number }).rating ?? 0) >= 8)
      .map((m) => ({
        id: m.id,
        mediaType: "movie" as const,
        title: m.title,
        posterPath: m.poster_path,
        voteAverage: m.vote_average,
        rating: (m as MovieSummary & { rating?: number }).rating ?? 0,
      })),
    ...ratedTv
      .filter((t) => ((t as TvSummary & { rating?: number }).rating ?? 0) >= 8)
      .map((t) => ({
        id: t.id,
        mediaType: "tv" as const,
        title: t.name,
        posterPath: t.poster_path,
        voteAverage: t.vote_average,
        rating: (t as TvSummary & { rating?: number }).rating ?? 0,
      })),
  ];

  const recentIds = new Set(recentlyViewed.map((v) => `${v.mediaType}-${v.id}`));
  const dueForRewatch = highlyRated.filter((item) => !recentIds.has(`${item.mediaType}-${item.id}`)).slice(0, 12);

  if (dueForRewatch.length === 0) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
        Due for a Rewatch
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        You rated these 8+ but haven&apos;t opened them recently in this browser.
      </Typography>
      <Grid container spacing={2}>
        {dueForRewatch.map((item) => (
          <Grid key={`${item.mediaType}-${item.id}`} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
            <MediaCard
              id={item.id}
              title={item.title}
              subtitle={`Your rating: ${item.rating}`}
              posterPath={item.posterPath}
              voteAverage={item.voteAverage}
              mediaType={item.mediaType}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
