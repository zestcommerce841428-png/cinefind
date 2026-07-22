"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import {
  subscribeRecentlyViewed,
  getRecentlyViewedSnapshot,
  getRecentlyViewedServerSnapshot,
} from "@/lib/recentlyViewed";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export default function ContinueExploring() {
  const items = React.useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  );
  const latest = items[0];
  const [results, setResults] = React.useState<(MovieSummary | TvSummary)[]>([]);

  React.useEffect(() => {
    if (!latest) return;
    let cancelled = false;
    fetch(`/api/recommendations?type=${latest.mediaType}&id=${latest.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResults(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      });
    return () => {
      cancelled = true;
    };
  }, [latest]);

  if (!latest || results.length === 0) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
        You Might Also Like
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Because you viewed{" "}
        <Link href={`/${latest.mediaType}/${latest.id}`}>{latest.title}</Link>
      </Typography>
      <MediaGrid items={results.slice(0, 6)} mediaType={latest.mediaType} />
    </Box>
  );
}
