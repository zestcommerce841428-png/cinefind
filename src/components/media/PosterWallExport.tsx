"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import { tmdbImage } from "@/lib/tmdb/config";

interface PosterWallExportProps {
  items: { title: string; posterPath: string | null }[];
  filename: string;
}

const POSTER_W = 200;
const POSTER_H = 300;
const GAP = 8;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function PosterWallExport({ items, filename }: PosterWallExportProps) {
  const [loading, setLoading] = React.useState(false);
  const withPosters = items.filter((i) => i.posterPath);

  if (withPosters.length === 0) return null;

  async function handleExport() {
    setLoading(true);
    try {
      const cols = Math.min(6, Math.ceil(Math.sqrt(withPosters.length * 1.5)));
      const rows = Math.ceil(withPosters.length / cols);
      const canvas = document.createElement("canvas");
      canvas.width = cols * POSTER_W + (cols + 1) * GAP;
      canvas.height = rows * POSTER_H + (rows + 1) * GAP;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#0b0b0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const images = await Promise.all(
        withPosters.map((item) => loadImage(tmdbImage(item.posterPath, "w500")!).catch(() => null))
      );

      images.forEach((img, i) => {
        if (!img) return;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = GAP + col * (POSTER_W + GAP);
        const y = GAP + row * (POSTER_H + GAP);
        ctx.drawImage(img, x, y, POSTER_W, POSTER_H);
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="small"
      variant="outlined"
      onClick={handleExport}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <DownloadIcon />}
    >
      {loading ? "Building poster wall…" : "Download Poster Wall"}
    </Button>
  );
}
