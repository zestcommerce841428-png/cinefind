"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";

interface TrailerPlayButtonProps {
  mediaType: "movie" | "tv";
  mediaId: number;
  size?: number;
  /** Optional pre-fetched trailer key, to skip the network round trip. */
  videoKey?: string | null;
}

export default function TrailerPlayButton({ mediaType, mediaId, size = 76, videoKey }: TrailerPlayButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [key, setKey] = React.useState<string | null>(videoKey ?? null);
  const [notFound, setNotFound] = React.useState(false);

  async function handleClick() {
    if (key) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/videos?type=${mediaType}&id=${mediaId}`);
      const data = await res.json();
      if (data.key) {
        setKey(data.key);
        setOpen(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="Play trailer"
        disabled={loading}
        sx={{
          width: size,
          height: size,
          bgcolor: "rgba(0,0,0,0.45)",
          border: "2px solid rgba(255,255,255,0.85)",
          color: "#fff",
          backdropFilter: "blur(2px)",
          transition: "transform 0.15s ease, background-color 0.15s ease",
          "&:hover": { bgcolor: "rgba(0,0,0,0.65)", transform: "scale(1.08)" },
        }}
      >
        {loading ? (
          <CircularProgress size={size * 0.4} sx={{ color: "#fff" }} />
        ) : (
          <PlayArrowIcon sx={{ fontSize: size * 0.5 }} />
        )}
      </IconButton>

      {notFound && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            mt: 1,
            whiteSpace: "nowrap",
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          No trailer available
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close trailer"
            sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
          {open && key && (
            <Box sx={{ position: "relative", aspectRatio: "16 / 9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${key}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
}
