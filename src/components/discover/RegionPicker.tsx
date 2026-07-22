"use client";

import { useRouter } from "next/navigation";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

interface Country {
  iso_3166_1: string;
  english_name: string;
}

const FEATURED = ["US", "GB", "IN", "CA", "AU", "DE", "FR", "JP", "KR", "BR", "MX", "ES"];

export default function RegionPicker({
  basePath,
  countries,
  value,
}: {
  basePath: string;
  countries: Country[];
  value: string;
}) {
  const router = useRouter();
  const sorted = [...countries].sort((a, b) => {
    const ai = FEATURED.indexOf(a.iso_3166_1);
    const bi = FEATURED.indexOf(b.iso_3166_1);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.english_name.localeCompare(b.english_name);
  });

  return (
    <Box sx={{ mb: 3, maxWidth: 260 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="region-picker-label">Region</InputLabel>
        <Select
          labelId="region-picker-label"
          label="Region"
          value={value}
          onChange={(e) => router.push(`${basePath}?region=${e.target.value}`)}
        >
          {sorted.map((c) => (
            <MenuItem key={c.iso_3166_1} value={c.iso_3166_1}>
              {c.english_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
