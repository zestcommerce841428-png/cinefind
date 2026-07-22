import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

export default function SignInRequired({ what = "this page" }: { what?: string }) {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
        Sign in to view {what}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect your TMDB account to sync favorites, watchlist, ratings, and custom lists.
      </Typography>
      <Button
        variant="contained"
        startIcon={<LoginIcon />}
        component="a"
        href="/api/auth/login"
        size="large"
      >
        Sign in with TMDB
      </Button>
    </Container>
  );
}
