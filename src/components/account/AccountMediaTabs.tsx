"use client";

import * as React from "react";
import Link from "@/components/common/NextLink";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, PaginatedResponse, TvSummary } from "@/lib/tmdb/types";

interface AccountMediaTabsProps {
  basePath: string;
  activeTab: "movie" | "tv";
  page: number;
  movies: PaginatedResponse<MovieSummary>;
  tv: PaginatedResponse<TvSummary>;
}

export default function AccountMediaTabs({
  basePath,
  activeTab,
  page,
  movies,
  tv,
}: AccountMediaTabsProps) {
  const data = activeTab === "movie" ? movies : tv;

  return (
    <>
      <Tabs value={activeTab} sx={{ mb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Tab
          value="movie"
          label={`Movies (${movies.total_results})`}
          component={Link}
          href={`${basePath}?type=movie`}
        />
        <Tab
          value="tv"
          label={`TV Shows (${tv.total_results})`}
          component={Link}
          href={`${basePath}?type=tv`}
        />
      </Tabs>

      {data.results.length === 0 ? (
        <Typography color="text.secondary">No items yet.</Typography>
      ) : (
        <MediaGrid items={data.results} mediaType={activeTab} />
      )}

      {data.total_pages > 1 && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Pagination
            page={page}
            count={Math.min(data.total_pages, 500)}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                href={`${basePath}?type=${activeTab}&page=${item.page}`}
                {...item}
              />
            )}
          />
        </Stack>
      )}
    </>
  );
}
