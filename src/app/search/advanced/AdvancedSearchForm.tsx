"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type { Genre } from "@/lib/tmdb/types";

const LANGUAGES = [
  { value: "", label: "Any Language" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
];

const CERTIFICATIONS = [
  { value: "", label: "Any Rating" },
  { value: "G", label: "G" },
  { value: "PG", label: "PG" },
  { value: "PG-13", label: "PG-13" },
  { value: "R", label: "R" },
  { value: "NC-17", label: "NC-17" },
];

export default function AdvancedSearchForm({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genreIds, setGenreIds] = React.useState<number[]>(
    (searchParams.get("with_genres") ?? "").split(",").filter(Boolean).map(Number)
  );
  const [yearFrom, setYearFrom] = React.useState(searchParams.get("year_from") ?? "");
  const [yearTo, setYearTo] = React.useState(searchParams.get("year_to") ?? "");
  const [ratingMin, setRatingMin] = React.useState(searchParams.get("rating_min") ?? "");
  const [runtimeMin, setRuntimeMin] = React.useState(searchParams.get("runtime_min") ?? "");
  const [runtimeMax, setRuntimeMax] = React.useState(searchParams.get("runtime_max") ?? "");
  const [language, setLanguage] = React.useState(searchParams.get("language") ?? "");
  const [certification, setCertification] = React.useState(searchParams.get("certification") ?? "");

  function toggleGenre(id: number) {
    setGenreIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (genreIds.length) params.set("with_genres", genreIds.join(","));
    if (yearFrom) params.set("year_from", yearFrom);
    if (yearTo) params.set("year_to", yearTo);
    if (ratingMin) params.set("rating_min", ratingMin);
    if (runtimeMin) params.set("runtime_min", runtimeMin);
    if (runtimeMax) params.set("runtime_max", runtimeMax);
    if (language) params.set("language", language);
    if (certification) params.set("certification", certification);
    router.push(`/search/advanced?${params.toString()}`);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {genres.map((g) => (
          <Chip
            key={g.id}
            label={g.name}
            onClick={() => toggleGenre(g.id)}
            color={genreIds.includes(g.id) ? "primary" : "default"}
            variant={genreIds.includes(g.id) ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Year from"
            type="number"
            size="small"
            fullWidth
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Year to"
            type="number"
            size="small"
            fullWidth
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Minimum rating"
            type="number"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 10, step: 0.5 } }}
            value={ratingMin}
            onChange={(e) => setRatingMin(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="lang-label">Language</InputLabel>
            <Select
              labelId="lang-label"
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <MenuItem key={l.value} value={l.value}>
                  {l.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Runtime min (mins)"
            type="number"
            size="small"
            fullWidth
            value={runtimeMin}
            onChange={(e) => setRuntimeMin(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Runtime max (mins)"
            type="number"
            size="small"
            fullWidth
            value={runtimeMax}
            onChange={(e) => setRuntimeMax(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="cert-label">MPAA Rating</InputLabel>
            <Select
              labelId="cert-label"
              label="MPAA Rating"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            >
              {CERTIFICATIONS.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Button type="submit" variant="contained" fullWidth sx={{ height: 40 }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
