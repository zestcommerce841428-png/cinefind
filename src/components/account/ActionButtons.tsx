"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

interface ActionButtonsProps {
  mediaType: "movie" | "tv";
  mediaId: number;
  isAuthenticated: boolean;
  initialFavorite?: boolean;
  initialWatchlist?: boolean;
  initialRating?: number | null; // 0-10 TMDB scale
}

export default function ActionButtons({
  mediaType,
  mediaId,
  isAuthenticated,
  initialFavorite = false,
  initialWatchlist = false,
  initialRating = null,
}: ActionButtonsProps) {
  const [toast, setToast] = React.useState<{ message: string; severity: "success" | "error" } | null>(
    null
  );
  const [favorite, setFavorite] = React.useState(initialFavorite);
  const [watchlist, setWatchlist] = React.useState(initialWatchlist);
  const [rating, setRating] = React.useState<number | null>(
    initialRating ? initialRating / 2 : null
  );

  async function post(url: string, body: object) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setToast({
        message: data.status_message ?? (data.success ? "Success" : "Something went wrong"),
        severity: data.success ? "success" : "error",
      });
      return data.success as boolean;
    } catch {
      setToast({ message: "Network error", severity: "error" });
      return false;
    }
  }

  async function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    const ok = await post("/api/account/favorite", { mediaType, mediaId, favorite: next });
    if (!ok) setFavorite(!next);
  }

  async function toggleWatchlist() {
    const next = !watchlist;
    setWatchlist(next);
    const ok = await post("/api/account/watchlist", { mediaType, mediaId, watchlist: next });
    if (!ok) setWatchlist(!next);
  }

  if (!isAuthenticated) {
    return (
      <>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <Rating
            value={rating}
            onChange={(_, value) => {
              setRating(value);
              if (value) post("/api/guest/rate", { mediaType, mediaId, value: value * 2 });
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Rate as guest, or <a href="/api/auth/login">sign in with TMDB</a> for favorites
            and watchlist.
          </Typography>
        </Stack>
        <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
          {toast ? (
            <Alert severity={toast.severity} onClose={() => setToast(null)}>
              {toast.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
        <Button
          variant={favorite ? "contained" : "outlined"}
          color={favorite ? "error" : "primary"}
          startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={toggleFavorite}
        >
          {favorite ? "Favorited" : "Favorite"}
        </Button>
        <Button
          variant={watchlist ? "contained" : "outlined"}
          startIcon={watchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          onClick={toggleWatchlist}
        >
          {watchlist ? "On Watchlist" : "Watchlist"}
        </Button>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Rating
            value={rating}
            onChange={(_, value) => {
              setRating(value);
              if (value) post("/api/account/rate", { mediaType, mediaId, value: value * 2 });
            }}
          />
        </Stack>
      </Stack>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
