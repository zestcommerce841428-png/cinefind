"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  addToMarathon,
  removeFromMarathon,
  subscribeMarathon,
  getMarathonSnapshot,
  getMarathonServerSnapshot,
} from "@/lib/marathon";

export default function AddToMarathonButton({
  id,
  title,
  posterPath,
  runtime,
}: {
  id: number;
  title: string;
  posterPath: string | null;
  runtime: number;
}) {
  const items = React.useSyncExternalStore(subscribeMarathon, getMarathonSnapshot, getMarathonServerSnapshot);
  const added = items.some((item) => item.id === id);

  if (!runtime) return null;

  return (
    <Button
      size="small"
      variant={added ? "contained" : "outlined"}
      color={added ? "success" : "primary"}
      startIcon={added ? <PlaylistAddCheckIcon /> : <PlaylistAddIcon />}
      onClick={() =>
        added ? removeFromMarathon(id) : addToMarathon({ id, title, posterPath, runtime })
      }
    >
      {added ? "In Marathon" : "Add to Marathon"}
    </Button>
  );
}
