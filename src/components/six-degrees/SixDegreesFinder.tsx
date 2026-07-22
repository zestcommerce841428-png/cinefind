"use client";

import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "@/components/common/NextLink";

interface PersonOption {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
}

interface PathStep {
  via: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  connector?: string;
  connectorId?: number;
}

interface Result {
  degrees: number | null;
  path?: PathStep[];
  message?: string;
}

function PersonAutocomplete({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PersonOption | null;
  onChange: (v: PersonOption | null) => void;
}) {
  const [options, setOptions] = React.useState<PersonOption[]>([]);
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
        const res = await fetch(`/api/search/people?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setOptions(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [inputValue]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, v) => onChange(v)}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      options={options}
      loading={loading}
      getOptionLabel={(o) => o.title}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
    />
  );
}

export default function SixDegreesFinder() {
  const [a, setA] = React.useState<PersonOption | null>(null);
  const [b, setB] = React.useState<PersonOption | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFind() {
    if (!a || !b) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/six-degrees?a=${a.id}&b=${b.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <PersonAutocomplete label="First actor" value={a} onChange={setA} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            &amp;
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <PersonAutocomplete label="Second actor" value={b} onChange={setB} />
        </Grid>
        <Grid size={12}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
            disabled={!a || !b || loading}
            onClick={handleFind}
          >
            Find the connection
          </Button>
        </Grid>
      </Grid>

      {error && <Alert severity="error">{error}</Alert>}

      {result && result.degrees === 0 && <Alert severity="info">That&apos;s the same person.</Alert>}

      {result && result.degrees === null && (
        <Alert severity="warning">{result.message}</Alert>
      )}

      {result && result.degrees !== null && result.degrees > 0 && result.path && (
        <Alert severity="success">
          <Typography sx={{ fontWeight: 700, mb: 1 }}>
            {a?.title} and {b?.title} are {result.degrees} degree{result.degrees > 1 ? "s" : ""} apart
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2">
              {a?.title} appeared in{" "}
              <Link href={`/${result.path[0].mediaType}/${result.path[0].mediaId}`}>
                {result.path[0].via}
              </Link>
              {result.path[0].connector && (
                <>
                  {" "}
                  with{" "}
                  <Link href={`/person/${result.path[0].connectorId}`}>{result.path[0].connector}</Link>
                </>
              )}
              .
            </Typography>
            {result.path[1] && (
              <Typography variant="body2">
                {result.path[0].connector} appeared in{" "}
                <Link href={`/${result.path[1].mediaType}/${result.path[1].mediaId}`}>
                  {result.path[1].via}
                </Link>{" "}
                with {b?.title}.
              </Typography>
            )}
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
