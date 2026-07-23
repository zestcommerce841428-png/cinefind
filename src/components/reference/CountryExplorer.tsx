"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import * as Flags from "country-flag-icons/react/3x2";
import Link from "@/components/common/NextLink";

interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

function CountryFlag({ iso2 }: { iso2: string }) {
  const FlagSvg = (Flags as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[
    iso2.toUpperCase()
  ];
  if (!FlagSvg) return <PublicIcon sx={{ width: 28, height: 20 }} color="disabled" />;
  return <FlagSvg style={{ width: 28, height: 20, borderRadius: 2, flexShrink: 0 }} />;
}

export default function CountryExplorer({ countries }: { countries: Country[] }) {
  const [query, setQuery] = React.useState("");
  const [letter, setLetter] = React.useState<string | null>(null);

  const sorted = React.useMemo(
    () => [...countries].sort((a, b) => a.english_name.localeCompare(b.english_name)),
    [countries]
  );

  const letters = React.useMemo(
    () => Array.from(new Set(sorted.map((c) => c.english_name[0]?.toUpperCase()))).sort(),
    [sorted]
  );

  const filtered = sorted.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      c.english_name.toLowerCase().includes(q) ||
      c.native_name?.toLowerCase().includes(q) ||
      c.iso_3166_1.toLowerCase().includes(q);
    const matchesLetter = !letter || c.english_name[0]?.toUpperCase() === letter;
    return matchesQuery && matchesLetter;
  });

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search countries or regions…"
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
        {filtered.length} of {sorted.length} countries and regions
      </Typography>

      <Grid container spacing={1.5}>
        {filtered.map((c) => (
          <Grid key={c.iso_3166_1} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              component={Link}
              href={`/country/${c.iso_3166_1}`}
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
              <CountryFlag iso2={c.iso_3166_1} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {c.english_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {c.iso_3166_1}
                  {c.native_name && c.native_name !== c.english_name ? ` · ${c.native_name}` : ""}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid size={12}>
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No countries match &quot;{query}&quot;.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
