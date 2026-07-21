import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { tmdbImage } from "@/lib/tmdb/config";
import type { WatchProviderResponse } from "@/lib/tmdb/types";

function ProviderGroup({ label, providers }: { label: string; providers?: { provider_id: number; provider_name: string; logo_path: string }[] }) {
  if (!providers?.length) return null;
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
        {providers.map((p) => (
          <Avatar
            key={p.provider_id}
            src={tmdbImage(p.logo_path, "w92") ?? undefined}
            alt={p.provider_name}
            variant="rounded"
            sx={{ width: 40, height: 40 }}
            title={p.provider_name}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default function WatchProviders({
  data,
  region = "US",
}: {
  data: WatchProviderResponse;
  region?: string;
}) {
  const entry = data.results?.[region];
  if (!entry) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
        Where to Watch
      </Typography>
      <ProviderGroup label="Stream" providers={entry.flatrate} />
      <ProviderGroup label="Rent" providers={entry.rent} />
      <ProviderGroup label="Buy" providers={entry.buy} />
      <Typography variant="caption" color="text.secondary">
        Data provided by{" "}
        <Link href={entry.link} target="_blank" rel="noopener noreferrer">
          JustWatch
        </Link>
        . Availability shown for {region}.
      </Typography>
    </Box>
  );
}
