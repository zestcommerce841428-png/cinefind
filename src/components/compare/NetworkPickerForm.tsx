"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

interface NetworkOption {
  id: number;
  name: string;
}

export default function NetworkPickerForm({ networks }: { networks: NetworkOption[] }) {
  const router = useRouter();
  const [a, setA] = React.useState("");
  const [b, setB] = React.useState("");

  function handleCompare() {
    if (!a || !b) return;
    router.push(`/compare/network?a=${a}&b=${b}`);
  }

  return (
    <Grid container spacing={2} sx={{ alignItems: "center", mb: 4 }}>
      <Grid size={{ xs: 12, sm: 5 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="network-a-label">First network</InputLabel>
          <Select labelId="network-a-label" label="First network" value={a} onChange={(e) => setA(e.target.value)}>
            {networks.map((n) => (
              <MenuItem key={n.id} value={String(n.id)}>
                {n.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          vs
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="network-b-label">Second network</InputLabel>
          <Select labelId="network-b-label" label="Second network" value={b} onChange={(e) => setB(e.target.value)}>
            {networks.map((n) => (
              <MenuItem key={n.id} value={String(n.id)}>
                {n.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <Button variant="contained" startIcon={<CompareArrowsIcon />} disabled={!a || !b} onClick={handleCompare}>
          Compare
        </Button>
      </Grid>
    </Grid>
  );
}
