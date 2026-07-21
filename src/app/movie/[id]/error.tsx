"use client";

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function MovieError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNetworkFailure = error.message?.includes("Could not reach api.themoviedb.org");

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Couldn&apos;t load this movie
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {isNetworkFailure
          ? "Your server couldn't reach TMDB's API over the network."
          : "Something went wrong fetching this title from TMDB. Please try again."}
      </Typography>
      {isNetworkFailure && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "left", bgcolor: "action.hover", borderRadius: 2, p: 2 }}
        >
          This means the request never got a response from api.themoviedb.org — it&apos;s not an
          invalid API key. Check: (1) your internet connection, (2) whether a firewall, VPN,
          antivirus, or corporate proxy is blocking outbound HTTPS to api.themoviedb.org, (3) if
          you&apos;re on Windows with a flaky IPv6 setup, try restarting the dev server with{" "}
          <code>NODE_OPTIONS=--dns-result-order=ipv4first npm run dev</code>.
        </Typography>
      )}
      <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => reset()}>
          Try Again
        </Button>
      </Stack>
    </Container>
  );
}
