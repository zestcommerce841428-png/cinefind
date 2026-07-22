"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import {
  subscribeRecentlyViewed,
  getRecentlyViewedSnapshot,
  getRecentlyViewedServerSnapshot,
} from "@/lib/recentlyViewed";

const DAYS = 30;

function dayKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export default function WatchHistoryHeatmap() {
  const items = React.useSyncExternalStore(
    subscribeRecentlyViewed,
    getRecentlyViewedSnapshot,
    getRecentlyViewedServerSnapshot
  );

  if (items.length === 0) return null;

  const counts = new Map<string, number>();
  for (const item of items) {
    const key = dayKey(item.viewedAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const today = new Date();
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  const max = Math.max(...counts.values(), 1);

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Browsing activity — last {DAYS} days
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        {days.map((day) => {
          const count = counts.get(day) ?? 0;
          const intensity = count > 0 ? 0.2 + (count / max) * 0.8 : 0;
          return (
            <Tooltip key={day} title={`${day}: ${count} title${count === 1 ? "" : "s"} viewed`}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: 0.75,
                  bgcolor: count > 0 ? (t) => alpha(t.palette.primary.main, intensity) : "action.hover",
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
