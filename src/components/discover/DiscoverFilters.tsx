"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import type { Genre } from "@/lib/tmdb/types";
import { tmdbImage } from "@/lib/tmdb/config";

interface WatchProviderOption {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

const RELEASE_TYPES = [
  { value: "1", label: "Premiere" },
  { value: "2", label: "Limited Theatrical" },
  { value: "3", label: "Theatrical" },
  { value: "4", label: "Digital" },
  { value: "5", label: "Physical" },
  { value: "6", label: "TV" },
];

interface DiscoverFiltersProps {
  basePath: string;
  genres: Genre[];
  /** Movie discover only — TMDB's discover/tv has no concept of release type. */
  showReleaseTypeFilter?: boolean;
  providers?: WatchProviderOption[];
}

export default function DiscoverFilters({
  basePath,
  genres,
  showReleaseTypeFilter = false,
  providers = [],
}: DiscoverFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sort_by") ?? "popularity.desc";
  const rawGenres = searchParams.get("with_genres") ?? "";
  const genreMode: "and" | "or" = rawGenres.includes("|") ? "or" : "and";
  const selectedGenres = rawGenres
    .split(/[,|]/)
    .filter(Boolean)
    .map(Number);
  const year = searchParams.get("year") ?? "";
  const releaseTypes = (searchParams.get("with_release_type") ?? "")
    .split("|")
    .filter(Boolean);
  const rawProviders = searchParams.get("with_watch_providers") ?? "";
  const providerMode: "and" | "or" = rawProviders.includes(",") ? "and" : "or";
  const selectedProviders = rawProviders
    .split(/[,|]/)
    .filter(Boolean)
    .map(Number);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort By"
              value={sortBy}
              onChange={(e) => updateParams({ sort_by: e.target.value })}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 5 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="genre-label">Genres (unlimited)</InputLabel>
            <Select
              labelId="genre-label"
              multiple
              label="Genres (unlimited)"
              value={selectedGenres}
              input={<OutlinedInput label="Genres (unlimited)" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(selected as number[]).map((id) => (
                    <Chip key={id} label={genres.find((g) => g.id === id)?.name ?? id} size="small" />
                  ))}
                </Box>
              )}
              onChange={(e) => {
                const value = e.target.value;
                const arr = typeof value === "string" ? value.split(",").map(Number) : (value as number[]);
                const separator = genreMode === "or" ? "|" : ",";
                updateParams({ with_genres: arr.join(separator) || null });
              }}
            >
              {genres.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: "auto" }}>
          <Tooltip title="Match ALL selected genres, or ANY of them — pick as many genres as you like, there's no cap">
            <ToggleButtonGroup
              exclusive
              size="small"
              value={genreMode}
              onChange={(_, mode) => {
                if (!mode || selectedGenres.length === 0) return;
                const separator = mode === "or" ? "|" : ",";
                updateParams({ with_genres: selectedGenres.join(separator) });
              }}
              sx={{ height: 40 }}
            >
              <ToggleButton value="and">Match ALL</ToggleButton>
              <ToggleButton value="or">Match ANY</ToggleButton>
            </ToggleButtonGroup>
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              label="Year"
              value={year}
              onChange={(e) => updateParams({ year: e.target.value || null })}
            >
              <MenuItem value="">Any</MenuItem>
              {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <MenuItem key={y} value={String(y)}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {providers.length > 0 && (
          <>
            <Grid size={{ xs: 12, sm: 8 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="providers-label">Streaming Providers</InputLabel>
                <Select
                  labelId="providers-label"
                  multiple
                  label="Streaming Providers"
                  value={selectedProviders}
                  input={<OutlinedInput label="Streaming Providers" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {(selected as number[]).map((id) => (
                        <Chip
                          key={id}
                          size="small"
                          label={providers.find((p) => p.provider_id === id)?.provider_name ?? id}
                        />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    const arr = typeof value === "string" ? value.split(",").map(Number) : (value as number[]);
                    const separator = providerMode === "and" ? "," : "|";
                    updateParams({
                      with_watch_providers: arr.join(separator) || null,
                      watch_region: arr.length > 0 ? "US" : null,
                    });
                  }}
                >
                  {providers.map((p) => (
                    <MenuItem key={p.provider_id} value={p.provider_id}>
                      <Avatar
                        src={tmdbImage(p.logo_path, "w45") ?? undefined}
                        variant="rounded"
                        sx={{ width: 20, height: 20, mr: 1 }}
                      />
                      {p.provider_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: "auto" }}>
              <Tooltip title="Available on ALL selected services, or ANY one of them">
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={providerMode}
                  onChange={(_, mode) => {
                    if (!mode || selectedProviders.length === 0) return;
                    const separator = mode === "and" ? "," : "|";
                    updateParams({ with_watch_providers: selectedProviders.join(separator) });
                  }}
                  sx={{ height: 40 }}
                >
                  <ToggleButton value="and">On ALL</ToggleButton>
                  <ToggleButton value="or">On ANY</ToggleButton>
                </ToggleButtonGroup>
              </Tooltip>
            </Grid>
          </>
        )}

        {showReleaseTypeFilter && (
          <Grid size={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="release-type-label">Release Type</InputLabel>
              <Select
                labelId="release-type-label"
                multiple
                label="Release Type"
                value={releaseTypes}
                input={<OutlinedInput label="Release Type" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {(selected as string[]).map((v) => (
                      <Chip key={v} label={RELEASE_TYPES.find((r) => r.value === v)?.label ?? v} size="small" />
                    ))}
                  </Box>
                )}
                onChange={(e) => {
                  const value = e.target.value;
                  const arr = typeof value === "string" ? value.split(",") : value;
                  updateParams({ with_release_type: arr.join("|") || null });
                }}
              >
                {RELEASE_TYPES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
