"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

interface TitleOption {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
}

export type CompareKind = "movie" | "tv" | "company";

const SEARCH_ENDPOINTS: Record<CompareKind, string> = {
  movie: "/api/search/movies",
  tv: "/api/search/tv",
  company: "/api/search/companies",
};

function TitleAutocomplete({
  label,
  kind,
  value,
  onChange,
}: {
  label: string;
  kind: CompareKind;
  value: TitleOption | null;
  onChange: (v: TitleOption | null) => void;
}) {
  const [options, setOptions] = React.useState<TitleOption[]>([]);
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
        const res = await fetch(`${SEARCH_ENDPOINTS[kind]}?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setOptions(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [inputValue, kind]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, v) => onChange(v)}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      options={options}
      loading={loading}
      getOptionLabel={(o) => `${o.title}${o.year ? ` (${o.year})` : ""}`}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
    />
  );
}

const ROUTE_SEGMENT: Record<CompareKind, string> = {
  movie: "movie",
  tv: "tv",
  company: "company",
};

export default function ComparePickerForm({
  mediaType,
  kind,
}: {
  mediaType?: "movie" | "tv";
  kind?: CompareKind;
}) {
  const resolvedKind = kind ?? mediaType ?? "movie";
  const router = useRouter();
  const [a, setA] = React.useState<TitleOption | null>(null);
  const [b, setB] = React.useState<TitleOption | null>(null);

  function handleCompare() {
    if (!a || !b) return;
    router.push(`/compare/${ROUTE_SEGMENT[resolvedKind]}?a=${a.id}&b=${b.id}`);
  }

  const label = resolvedKind === "company" ? "studio" : "title";

  return (
    <Grid container spacing={2} sx={{ alignItems: "center", mb: 4 }}>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TitleAutocomplete label={`First ${label}`} kind={resolvedKind} value={a} onChange={setA} />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          vs
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TitleAutocomplete label={`Second ${label}`} kind={resolvedKind} value={b} onChange={setB} />
      </Grid>
      <Grid size={12}>
        <Button
          variant="contained"
          startIcon={<CompareArrowsIcon />}
          disabled={!a || !b}
          onClick={handleCompare}
        >
          Compare
        </Button>
      </Grid>
    </Grid>
  );
}
