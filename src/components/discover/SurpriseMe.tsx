"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import CasinoIcon from "@mui/icons-material/Casino";

interface Genre {
  id: number;
  name: string;
}

export default function SurpriseMe({ movieGenres, tvGenres }: { movieGenres: Genre[]; tvGenres: Genre[] }) {
  const [mediaType, setMediaType] = React.useState<"movie" | "tv">("movie");
  const [genreId, setGenreId] = React.useState<string>("");
  const genres = mediaType === "movie" ? movieGenres : tvGenres;

  function handleSurprise() {
    const query = genreId ? `?genre=${genreId}` : "";
    window.location.href = `/random/${mediaType}${query}`;
  }

  return (
    <Box
      sx={{
        p: 3,
        mb: 5,
        borderRadius: 3,
        bgcolor: "action.hover",
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
        Feeling Lucky?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Pick a type and (optionally) a genre, then let us surprise you with something popular to watch.
      </Typography>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={mediaType}
          onChange={(_, v) => {
            if (v) {
              setMediaType(v);
              setGenreId("");
            }
          }}
        >
          <ToggleButton value="movie">Movie</ToggleButton>
          <ToggleButton value="tv">TV</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select displayEmpty value={genreId} onChange={(e) => setGenreId(e.target.value)}>
            <MenuItem value="">Any genre</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g.id} value={String(g.id)}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" startIcon={<CasinoIcon />} onClick={handleSurprise}>
          Surprise Me
        </Button>
      </Stack>
    </Box>
  );
}
