"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "@/components/common/NextLink";
import { tmdbImage } from "@/lib/tmdb/config";
import {
  removeFromMarathon,
  clearMarathon,
  subscribeMarathon,
  getMarathonSnapshot,
  getMarathonServerSnapshot,
} from "@/lib/marathon";

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function MarathonPlanner() {
  const items = React.useSyncExternalStore(subscribeMarathon, getMarathonSnapshot, getMarathonServerSnapshot);
  const [startTime, setStartTime] = React.useState("19:00");

  if (items.length === 0) {
    return (
      <Typography color="text.secondary">
        Your marathon is empty. Browse{" "}
        <Link href="/movies/popular">popular movies</Link> and add a few to get started.
      </Typography>
    );
  }

  const totalMinutes = items.reduce((sum, item) => sum + item.runtime, 0);

  const [h, m] = startTime.split(":").map(Number);
  const schedule = items.reduce<{ item: (typeof items)[number]; start: number }[]>((acc, item) => {
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].start + acc[acc.length - 1].item.runtime : h * 60 + m;
    return [...acc, { item, start: previousEnd }];
  }, []);
  const cursor =
    schedule.length > 0
      ? schedule[schedule.length - 1].start + schedule[schedule.length - 1].item.runtime
      : h * 60 + m;

  function formatClock(totalMins: number) {
    const wrapped = ((totalMins % 1440) + 1440) % 1440;
    const hh = Math.floor(wrapped / 60);
    const mm = wrapped % 60;
    const period = hh >= 12 ? "PM" : "AM";
    const displayHour = hh % 12 === 0 ? 12 : hh % 12;
    return `${displayHour}:${String(mm).padStart(2, "0")} ${period}`;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          label="Start time"
          type="time"
          size="small"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {formatDuration(totalMinutes)} total
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {items.length} movie{items.length === 1 ? "" : "s"} · ends around {formatClock(cursor)}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1.5}>
        {schedule.map(({ item, start }) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
          >
            <Avatar
              variant="rounded"
              src={tmdbImage(item.posterPath, "w92") ?? undefined}
              sx={{ width: 44, height: 66 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Starts {formatClock(start)} · {formatDuration(item.runtime)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => removeFromMarathon(item.id)} aria-label={`Remove ${item.title}`}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button color="inherit" onClick={clearMarathon} sx={{ alignSelf: "flex-start" }}>
        Clear marathon
      </Button>
    </Stack>
  );
}
