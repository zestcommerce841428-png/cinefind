"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";

interface TasteProfileCardExportProps {
  total: number;
  topGenres: [string, number][];
  personaLabel?: string;
  personaEmoji?: string;
}

export default function TasteProfileCardExport({
  total,
  topGenres,
  personaLabel,
  personaEmoji,
}: TasteProfileCardExportProps) {
  const [loading, setLoading] = React.useState(false);

  function handleExport() {
    setLoading(true);
    try {
      const width = 800;
      const height = 1000;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#12161f");
      gradient.addColorStop(1, "#1b2130");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText("My CineFind Taste Profile", 56, 80);

      ctx.fillStyle = "#8b93a7";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Based on ${total} rated, favorited, and watchlisted titles`, 56, 116);

      if (personaLabel) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px sans-serif";
        ctx.fillText(`${personaEmoji ?? ""} ${personaLabel}`, 56, 190);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#8b93a7";
        ctx.fillText("Closest taste persona", 56, 218);
      }

      const chartTop = 270;
      const maxCount = topGenres[0]?.[1] ?? 1;
      const barMaxWidth = width - 112 - 60;
      ctx.font = "20px sans-serif";
      topGenres.slice(0, 8).forEach(([name, count], i) => {
        const y = chartTop + i * 74;
        ctx.fillStyle = "#e6e9f0";
        ctx.fillText(name, 56, y);
        ctx.fillStyle = "#8b93a7";
        ctx.textAlign = "right";
        ctx.fillText(String(count), width - 56, y);
        ctx.textAlign = "left";

        const barWidth = Math.max((count / maxCount) * barMaxWidth, 6);
        ctx.fillStyle = "#7c5cff";
        const barY = y + 14;
        ctx.beginPath();
        ctx.roundRect(56, barY, barWidth, 14, 7);
        ctx.fill();
      });

      ctx.fillStyle = "#8b93a7";
      ctx.font = "16px sans-serif";
      ctx.fillText("cinefind — find your next watch", 56, height - 40);

      const link = document.createElement("a");
      link.download = "my-cinefind-taste-profile.png";
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
      {loading ? "Building image…" : "Share as Image"}
    </Button>
  );
}
