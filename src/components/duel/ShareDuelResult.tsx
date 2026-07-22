"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import { tmdbImage } from "@/lib/tmdb/config";

interface ShareDuelResultProps {
  title: string;
  posterPath: string | null;
  year?: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function ShareDuelResult({ title, posterPath, year }: ShareDuelResultProps) {
  const [loading, setLoading] = React.useState(false);
  const posterUrl = tmdbImage(posterPath, "w500");

  if (!posterUrl) return null;

  async function handleExport() {
    setLoading(true);
    try {
      const width = 600;
      const height = 900;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#0b0b0f";
      ctx.fillRect(0, 0, width, height);

      const img = await loadImage(posterUrl!);
      const posterHeight = 780;
      ctx.drawImage(img, 20, 20, width - 40, posterHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(title, width / 2, posterHeight + 65, width - 60);

      ctx.fillStyle = "#c9c9d4";
      ctx.font = "16px sans-serif";
      ctx.fillText(
        `Winner of my Movie Duel${year ? ` · ${year}` : ""} — cinefind`,
        width / 2,
        posterHeight + 95
      );

      const link = document.createElement("a");
      link.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-duel-winner.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outlined"
      onClick={handleExport}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
    >
      {loading ? "Building image…" : "Share Result as Image"}
    </Button>
  );
}
