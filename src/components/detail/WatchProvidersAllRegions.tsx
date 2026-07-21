"use client";

import * as React from "react";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { tmdbImage } from "@/lib/tmdb/config";
import type { WatchProviderResponse } from "@/lib/tmdb/types";

function ProviderGroup({
  label,
  providers,
}: {
  label: string;
  providers?: { provider_id: number; provider_name: string; logo_path: string }[];
}) {
  if (!providers?.length) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
        {label}
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap" }}>
        {providers.map((p) => (
          <Stack key={p.provider_id} sx={{ alignItems: "center", width: 72 }}>
            <Avatar
              src={tmdbImage(p.logo_path, "w92") ?? undefined}
              variant="rounded"
              sx={{ width: 48, height: 48 }}
            />
            <Typography variant="caption" align="center" noWrap sx={{ maxWidth: 72 }}>
              {p.provider_name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function WatchProvidersAllRegions({
  title,
  backHref,
  data,
}: {
  title: string;
  backHref: string;
  data: WatchProviderResponse;
}) {
  const countries = Object.keys(data.results ?? {}).sort();
  const [region, setRegion] = React.useState(countries.includes("US") ? "US" : countries[0] ?? "US");
  const entry = data.results?.[region];

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Where to Watch</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Where to Watch
      </Typography>

      <FormControl size="small" sx={{ mb: 3, minWidth: 220 }}>
        <InputLabel id="region-label">Country / Region</InputLabel>
        <Select
          labelId="region-label"
          label="Country / Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!entry ? (
        <Typography color="text.secondary">
          No streaming availability data for this region.
        </Typography>
      ) : (
        <Box>
          <ProviderGroup label="Stream" providers={entry.flatrate} />
          <ProviderGroup label="Rent" providers={entry.rent} />
          <ProviderGroup label="Buy" providers={entry.buy} />
          <Typography variant="caption" color="text.secondary">
            Data provided by{" "}
            <a href={entry.link} target="_blank" rel="noopener noreferrer">
              JustWatch
            </a>{" "}
            via TMDB.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
