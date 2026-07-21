"use client";

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        An unexpected error occurred. Please try again.
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try Again
      </Button>
    </Container>
  );
}
