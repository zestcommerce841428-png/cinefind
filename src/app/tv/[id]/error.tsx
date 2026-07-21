"use client";

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function TvError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Couldn&apos;t load this show
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Something went wrong fetching this title from TMDB. Please try again.
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => reset()}>
          Try Again
        </Button>
      </Stack>
    </Container>
  );
}
