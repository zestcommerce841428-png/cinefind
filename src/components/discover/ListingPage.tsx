"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";
import type { PaginatedResponse } from "@/lib/tmdb/types";

interface ListingPageProps {
  title: string;
  description?: string;
  basePath: string;
  data: PaginatedResponse<MovieSummary | TvSummary>;
  mediaType: "movie" | "tv";
  extraParams?: Record<string, string | undefined>;
  /**
   * The exact discover/TMDB query (e.g. { with_genres, sort_by,
   * "primary_release_date.gte" }) used to fetch `data`. When provided, a
   * "Load more" button appends further pages client-side — with no upper
   * bound besides TMDB's own 500-page ceiling — instead of only linking to
   * numbered pages.
   */
  discoverParams?: Record<string, string | number | undefined>;
  bare?: boolean;
}

export default function ListingPage({
  title,
  description,
  basePath,
  data,
  mediaType,
  extraParams = {},
  discoverParams,
  bare = false,
}: ListingPageProps) {
  const query = new URLSearchParams(
    Object.entries(extraParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  const [items, setItems] = React.useState(data.results);
  const [page, setPage] = React.useState(data.page);
  const [totalPages, setTotalPages] = React.useState(data.total_pages);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [prevData, setPrevData] = React.useState(data);

  // Reset accumulated state when the server hands us a fresh `data` object
  // (filters changed, or the user jumped to a numbered page) — adjusting
  // state during render, per React's guidance, rather than in an effect.
  if (data !== prevData) {
    setPrevData(data);
    setItems(data.results);
    setPage(data.page);
    setTotalPages(data.total_pages);
  }

  const canLoadMore = Boolean(discoverParams) && page < Math.min(totalPages, 500);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(discoverParams ?? {})) {
        if (value !== undefined && value !== "") params.set(key, String(value));
      }
      params.set("mediaType", mediaType);
      params.set("page", String(page + 1));
      const res = await fetch(`/api/discover?${params}`);
      const json: PaginatedResponse<MovieSummary | TvSummary> = await res.json();
      setItems((prev) => [...prev, ...json.results]);
      setPage(json.page);
      setTotalPages(json.total_pages);
    } finally {
      setLoadingMore(false);
    }
  }

  const body = (
    <>
      {title && (
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      <MediaGrid items={items} mediaType={mediaType} />

      {canLoadMore && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={16} /> : <ExpandMoreIcon />}
          >
            {loadingMore ? "Loading…" : "Load More"}
          </Button>
        </Stack>
      )}

      {!discoverParams && totalPages > 1 && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Pagination
            page={page}
            count={Math.min(totalPages, 500)}
            color="primary"
            renderItem={(item) => {
              const pageQuery = new URLSearchParams(query);
              pageQuery.set("page", String(item.page));
              return (
                <PaginationItem component={Link} href={`${basePath}?${pageQuery}`} {...item} />
              );
            }}
          />
        </Stack>
      )}
    </>
  );

  if (bare) return body;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {body}
    </Container>
  );
}
