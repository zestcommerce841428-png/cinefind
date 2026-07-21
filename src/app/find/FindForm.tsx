"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

const SOURCES = [
  { value: "imdb_id", label: "IMDb ID" },
  { value: "tvdb_id", label: "TheTVDB ID" },
  { value: "facebook_id", label: "Facebook Username" },
  { value: "instagram_id", label: "Instagram Username" },
  { value: "twitter_id", label: "X / Twitter Username" },
];

export default function FindForm({
  initialId,
  initialSource,
}: {
  initialId: string;
  initialSource: string;
}) {
  const router = useRouter();
  const [id, setId] = React.useState(initialId);
  const [source, setSource] = React.useState(initialSource);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id.trim()) {
      router.push(`/find?id=${encodeURIComponent(id.trim())}&source=${source}`);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" sx={{ gap: 2, flexWrap: "wrap", alignItems: "flex-start" }}>
        <TextField
          label="External ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="tt0111161"
          size="small"
          sx={{ minWidth: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="source-label">Source</InputLabel>
          <Select
            labelId="source-label"
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            {SOURCES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ height: 40 }}>
          Look Up
        </Button>
      </Stack>
    </Box>
  );
}
