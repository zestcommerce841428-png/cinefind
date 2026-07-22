"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import MediaGrid from "./MediaGrid";
import type { MovieSummary } from "@/lib/tmdb/types";

type Order = "release" | "popularity";

export default function CollectionOrderToggle({ items }: { items: MovieSummary[] }) {
  const [order, setOrder] = React.useState<Order>("release");

  const sorted = React.useMemo(() => {
    const copy = [...items];
    if (order === "release") {
      copy.sort((a, b) => (a.release_date || "9999").localeCompare(b.release_date || "9999"));
    } else {
      copy.sort((a, b) => b.popularity - a.popularity);
    }
    return copy;
  }, [items, order]);

  return (
    <Box>
      <ToggleButtonGroup
        value={order}
        exclusive
        size="small"
        onChange={(_, v) => v && setOrder(v)}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="release">Watch in Release Order</ToggleButton>
        <ToggleButton value="popularity">Most Popular First</ToggleButton>
      </ToggleButtonGroup>
      <MediaGrid items={sorted} mediaType="movie" />
    </Box>
  );
}
