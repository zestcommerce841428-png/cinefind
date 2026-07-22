"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface KeywordOption {
  id: number;
  name: string;
}

export default function KeywordSearchBox() {
  const router = useRouter();
  const [options, setOptions] = React.useState<KeywordOption[]>([]);
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
        const res = await fetch(`/api/search/keywords?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setOptions(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      value={null}
      onChange={(_, v) => {
        if (v) router.push(`/keyword/${v.id}`);
      }}
      getOptionLabel={(o) => o.name}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      renderInput={(params) => (
        <TextField {...params} label="Search any keyword tag" placeholder="e.g. time travel, heist, dystopia" />
      )}
    />
  );
}
