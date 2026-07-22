"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";
import ScheduleIcon from "@mui/icons-material/Schedule";

function daysUntil(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function ReleaseCountdown({ releaseDate }: { releaseDate: string }) {
  const days = daysUntil(releaseDate);
  if (days <= 0) return null;

  return (
    <Chip
      icon={<ScheduleIcon />}
      color="info"
      variant="outlined"
      size="small"
      label={days === 1 ? "Releases tomorrow" : `Releases in ${days} days`}
    />
  );
}
