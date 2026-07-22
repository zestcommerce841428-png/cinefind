"use client";

import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import GroupsIcon from "@mui/icons-material/Groups";
import MediaCard from "@/components/media/MediaCard";
import type { MovieSummary } from "@/lib/tmdb/types";

interface MovieOption {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
  genre_ids: number[];
}

interface ParticipantState {
  name: string;
  picks: MovieOption[];
}

function ParticipantColumn({
  participant,
  index,
  onNameChange,
  onAddPick,
  onRemovePick,
}: {
  participant: ParticipantState;
  index: number;
  onNameChange: (name: string) => void;
  onAddPick: (movie: MovieOption) => void;
  onRemovePick: (id: number) => void;
}) {
  const [options, setOptions] = React.useState<MovieOption[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const trimmed = inputValue.trim();
    const handle = setTimeout(async () => {
      if (!trimmed) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search/movies?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setOptions(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [inputValue]);

  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
      <TextField
        fullWidth
        size="small"
        label={`Person ${index + 1}`}
        value={participant.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={`Person ${index + 1}`}
        sx={{ mb: 2 }}
      />
      <Autocomplete
        options={options}
        loading={loading}
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        value={null}
        onChange={(_, v) => {
          if (v) {
            onAddPick(v);
            setInputValue("");
          }
        }}
        getOptionLabel={(o) => `${o.title}${o.year ? ` (${o.year})` : ""}`}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        renderInput={(params) => <TextField {...params} label="Add a movie they like" size="small" />}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        {participant.picks.map((p) => (
          <Chip key={p.id} label={p.title} size="small" onDelete={() => onRemovePick(p.id)} />
        ))}
        {participant.picks.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No picks yet.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default function WatchPartyBuilder() {
  const [participants, setParticipants] = React.useState<ParticipantState[]>([
    { name: "", picks: [] },
    { name: "", picks: [] },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    commonGenres: string[];
    everyoneAgrees: boolean;
    results: MovieSummary[];
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function updateParticipant(index: number, next: Partial<ParticipantState>) {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...next } : p)));
  }

  function addParticipant() {
    if (participants.length >= 4) return;
    setParticipants((prev) => [...prev, { name: "", picks: [] }]);
  }

  function removeParticipant(index: number) {
    if (participants.length <= 2) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }

  async function findSomething() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/watch-party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: participants.map((p) => ({
            name: p.name,
            genreIds: p.picks.map((m) => m.genre_ids),
          })),
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = participants.filter((p) => p.picks.length > 0).length >= 2;

  return (
    <Box>
      <Grid container spacing={2}>
        {participants.map((participant, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 12 / Math.max(participants.length, 2) }}>
            <Box sx={{ position: "relative" }}>
              <ParticipantColumn
                participant={participant}
                index={i}
                onNameChange={(name) => updateParticipant(i, { name })}
                onAddPick={(movie) =>
                  updateParticipant(i, {
                    picks: participant.picks.some((p) => p.id === movie.id)
                      ? participant.picks
                      : [...participant.picks, movie],
                  })
                }
                onRemovePick={(id) => updateParticipant(i, { picks: participant.picks.filter((p) => p.id !== id) })}
              />
              {participants.length > 2 && (
                <Button
                  size="small"
                  onClick={() => removeParticipant(i)}
                  sx={{ position: "absolute", top: 4, right: 4, minWidth: 0, px: 1 }}
                >
                  ✕
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        {participants.length < 4 && (
          <Button variant="outlined" onClick={addParticipant}>
            + Add Person
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <GroupsIcon />}
          disabled={!canSubmit || loading}
          onClick={findSomething}
        >
          Find Something for Everyone
        </Button>
      </Box>

      {error && (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {result.everyoneAgrees ? "Everyone will love this" : "Closest common ground"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on shared taste in: {result.commonGenres.join(", ")}
          </Typography>
          <Grid container spacing={2}>
            {result.results.map((m) => (
              <Grid key={m.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <MediaCard
                  id={m.id}
                  title={m.title}
                  subtitle={m.release_date?.slice(0, 4)}
                  posterPath={m.poster_path}
                  voteAverage={m.vote_average}
                  mediaType="movie"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
