import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

export const metadata: Metadata = {
  title: "Developers",
  description: "Internal API routes that power CineFind, for reference and debugging.",
  alternates: { canonical: "/developers" },
};

interface Endpoint {
  method: "GET" | "POST" | "DELETE";
  path: string;
  description: string;
  auth?: "session" | "guest" | "secret";
}

const ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/api/health", description: "Liveness/readiness probe — pings TMDB and reports status." },
  { method: "GET", path: "/api/search/movies?q=", description: "Lightweight movie search used by autocomplete pickers." },
  { method: "GET", path: "/api/search/tv?q=", description: "Lightweight TV search used by autocomplete pickers." },
  { method: "GET", path: "/api/search/companies?q=", description: "Lightweight production-company search for Studio Showdown." },
  { method: "GET", path: "/api/calendar/upcoming.ics", description: "iCalendar feed of upcoming theatrical release dates." },
  { method: "GET", path: "/api/auth/login", description: "Starts the TMDB v3 request-token login flow." },
  { method: "GET", path: "/api/auth/callback", description: "TMDB OAuth callback — exchanges the approved token for a session." },
  { method: "POST", path: "/api/auth/logout", description: "Ends the current TMDB session.", auth: "session" },
  { method: "POST", path: "/api/account/favorite", description: "Add or remove a title from your favorites.", auth: "session" },
  { method: "POST", path: "/api/account/watchlist", description: "Add or remove a title from your watchlist.", auth: "session" },
  { method: "POST", path: "/api/account/rate", description: "Rate a title (1.0–10.0) as a signed-in user.", auth: "session" },
  { method: "DELETE", path: "/api/account/rate", description: "Remove your rating from a title.", auth: "session" },
  { method: "POST", path: "/api/guest/rate", description: "Rate a title without signing in, via a guest session.", auth: "guest" },
  { method: "GET", path: "/api/lists", description: "List your custom TMDB lists.", auth: "session" },
  { method: "POST", path: "/api/lists", description: "Create a new custom list.", auth: "session" },
  { method: "GET", path: "/api/lists/[id]", description: "Fetch a single custom list and its items." },
  { method: "DELETE", path: "/api/lists/[id]", description: "Delete a custom list.", auth: "session" },
  { method: "POST", path: "/api/lists/[id]/items", description: "Add an item to a custom list.", auth: "session" },
  { method: "DELETE", path: "/api/lists/[id]/items", description: "Remove an item from a custom list.", auth: "session" },
  { method: "POST", path: "/api/revalidate?secret=&path=", description: "On-demand ISR cache purge for a path or tag.", auth: "secret" },
];

const METHOD_COLOR: Record<Endpoint["method"], "success" | "warning" | "error"> = {
  GET: "success",
  POST: "warning",
  DELETE: "error",
};

export default function DevelopersPage() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Developers
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        CineFind is a Next.js app with server-side TMDB proxying — the browser never sees your API key.
        These are the internal routes that power the UI, listed here for reference and debugging.
      </Typography>

      <Stack divider={<Divider />} spacing={2}>
        {ENDPOINTS.map((ep) => (
          <Box key={`${ep.method}-${ep.path}`}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Chip label={ep.method} size="small" color={METHOD_COLOR[ep.method]} sx={{ fontWeight: 700 }} />
              <Typography component="code" sx={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>
                {ep.path}
              </Typography>
              {ep.auth && <Chip label={ep.auth} size="small" variant="outlined" />}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {ep.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
