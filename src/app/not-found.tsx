import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: 64, md: 96 }, opacity: 0.2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Scene not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        We couldn&apos;t find the page you were looking for. It may have been moved, or never existed.
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
        <Button component={Link} href="/" variant="contained">
          Back Home
        </Button>
        <Button component={Link} href="/search" variant="outlined">
          Search Instead
        </Button>
      </Stack>
    </Container>
  );
}
