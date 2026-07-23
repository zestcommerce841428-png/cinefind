"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@/components/common/NextLink";

interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export default function LanguageExplorer({ languages }: { languages: Language[] }) {
  const [query, setQuery] = React.useState("");
  const [letter, setLetter] = React.useState<string | null>(null);

  const sorted = React.useMemo(
    () => [...languages].sort((a, b) => a.english_name.localeCompare(b.english_name)),
    [languages]
  );

  const letters = React.useMemo(
    () => Array.from(new Set(sorted.map((l) => l.english_name[0]?.toUpperCase()))).sort(),
    [sorted]
  );

  const filtered = sorted.filter((l) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      l.english_name.toLowerCase().includes(q) ||
      l.name?.toLowerCase().includes(q) ||
      l.iso_639_1.toLowerCase().includes(q);
    const matchesLetter = !letter || l.english_name[0]?.toUpperCase() === letter;
    return matchesQuery && matchesLetter;
  });

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search languages…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
        <Chip
          label="All"
          size="small"
          onClick={() => setLetter(null)}
          color={letter === null ? "secondary" : "default"}
          variant={letter === null ? "filled" : "outlined"}
        />
        {letters.map((l) => (
          <Chip
            key={l}
            label={l}
            size="small"
            onClick={() => setLetter(l)}
            color={letter === l ? "secondary" : "default"}
            variant={letter === l ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
        {filtered.length} of {sorted.length} languages
      </Typography>

      <Grid container spacing={1.5}>
        {filtered.map((l) => (
          <Grid key={l.iso_639_1} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              component={Link}
              href={`/language/${l.iso_639_1}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.15s ease, transform 0.15s ease",
                "&:hover": { borderColor: "primary.main", transform: "translateY(-1px)" },
              }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: "action.selected", color: "text.primary", fontSize: 13, fontWeight: 700 }}>
                {l.iso_639_1.toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {l.english_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {l.name && l.name !== l.english_name ? l.name : "—"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid size={12}>
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No languages match &quot;{query}&quot;.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
