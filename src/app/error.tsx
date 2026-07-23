"use client";

import { useEffect } from "react";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 64, md: 96 }, opacity: 0.2 }}>
        500
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        An unexpected error occurred while loading this page. This has been logged — try again, or
        head back home.
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => reset()}>
          Try Again
        </Button>
        <Button component={Link} href="/" variant="outlined">
          Back Home
        </Button>
      </Stack>
      {error.digest && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4 }}>
          Error reference: {error.digest}
        </Typography>
      )}
    </Container>
  );
}
