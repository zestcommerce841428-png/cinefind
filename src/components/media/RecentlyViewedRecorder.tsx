"use client";

import * as React from "react";
import { addRecentlyViewed } from "@/lib/recentlyViewed";

export default function RecentlyViewedRecorder({
  id,
  mediaType,
  title,
  posterPath,
  voteAverage,
}: {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  voteAverage: number;
}) {
  React.useEffect(() => {
    addRecentlyViewed({ id, mediaType, title, posterPath, voteAverage });
    // Intentionally re-run only when the viewed title changes, not on every
    // prop identity change (e.g. voteAverage reference churn from parent).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mediaType]);

  return null;
}
