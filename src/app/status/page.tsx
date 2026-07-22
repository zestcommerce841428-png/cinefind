import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { getConfiguration } from "@/lib/tmdb";

export const revalidate = 0;
export const metadata: Metadata = {
  title: "System Status",
  description: "Live status of CineFind and its connection to TMDB.",
  alternates: { canonical: "/status" },
};

async function checkTmdbStatus() {
  const startedAt = Date.now();
  let tmdbReachable = false;
  let tmdbError: string | undefined;

  try {
    await Promise.race([
      getConfiguration(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    tmdbReachable = true;
  } catch (err) {
    tmdbError = err instanceof Error ? err.message : "Unknown error";
  }

  return { tmdbReachable, tmdbError, latencyMs: Date.now() - startedAt };
}

export default async function StatusPage() {
  const { tmdbReachable, tmdbError, latencyMs } = await checkTmdbStatus();

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        System Status
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Checked live on every page load — this is not a cached or historical status page.
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>CineFind App</Typography>
            <Typography variant="caption" color="text.secondary">
              This page rendered successfully, so the app is serving requests.
            </Typography>
          </Box>
          <Chip label="Operational" color="success" size="small" sx={{ fontWeight: 700 }} />
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>TMDB API Connection</Typography>
            <Typography variant="caption" color="text.secondary">
              {tmdbReachable ? `Responded in ${latencyMs}ms` : tmdbError}
            </Typography>
          </Box>
          <Chip
            label={tmdbReachable ? "Operational" : "Degraded"}
            color={tmdbReachable ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: "block" }}>
        Machine-readable version: <code>/api/health</code>
      </Typography>
    </Container>
  );
}
