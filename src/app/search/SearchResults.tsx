"use client";

import * as React from "react";
import Link from "@/components/common/NextLink";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, PersonSummary, TvSummary } from "@/lib/tmdb/types";

type SearchItem = MovieSummary | TvSummary | PersonSummary;

interface SearchResultsProps {
  query: string;
  results: SearchItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export default function SearchResults({
  query,
  results,
  page,
  totalPages,
  totalResults,
}: SearchResultsProps) {
  const [tab, setTab] = React.useState<"all" | "movie" | "tv" | "person">("all");

  const filtered = tab === "all" ? results : results.filter((item) => item.media_type === tab);

  const counts = {
    all: results.length,
    movie: results.filter((r) => r.media_type === "movie").length,
    tv: results.filter((r) => r.media_type === "tv").length,
    person: results.filter((r) => r.media_type === "person").length,
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {totalResults.toLocaleString()} results for &ldquo;{query}&rdquo;
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Tab value="all" label={`All (${counts.all})`} />
        <Tab value="movie" label={`Movies (${counts.movie})`} />
        <Tab value="tv" label={`TV Shows (${counts.tv})`} />
        <Tab value="person" label={`People (${counts.person})`} />
      </Tabs>

      {filtered.length === 0 ? (
        <Typography color="text.secondary">No results in this category.</Typography>
      ) : (
        <MediaGrid items={filtered} />
      )}

      {totalPages > 1 && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Pagination
            page={page}
            count={Math.min(totalPages, 500)}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                href={`/search?q=${encodeURIComponent(query)}&page=${item.page}`}
                {...item}
              />
            )}
          />
        </Stack>
      )}
    </Box>
  );
}
