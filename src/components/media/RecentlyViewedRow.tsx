"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MediaCard from "./MediaCard";
import WatchHistoryHeatmap from "./WatchHistoryHeatmap";
import {
  clearRecentlyViewed,
  subscribeRecentlyViewed,
  getRecentlyViewedSnapshot,
  getRecentlyViewedServerSnapshot,
} from "@/lib/recentlyViewed";

export default function RecentlyViewedRow() {
  const items = React.useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  );

  if (items.length === 0) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Continue Exploring
        </Typography>
        <Button size="small" color="inherit" onClick={clearRecentlyViewed}>
          Clear
        </Button>
      </Stack>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {items.map((item) => (
          <Box
            key={`${item.mediaType}-${item.id}`}
            sx={{ flex: "0 0 auto", width: { xs: 140, sm: 170, md: 190 } }}
          >
            <MediaCard
              id={item.id}
              title={item.title}
              posterPath={item.posterPath}
              voteAverage={item.voteAverage}
              mediaType={item.mediaType}
            />
          </Box>
        ))}
      </Box>
      <WatchHistoryHeatmap />
    </Box>
  );
}
