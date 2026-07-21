import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

export const metadata: Metadata = {
  title: "Browse Movies by Rating",
  description: "Browse movies by MPAA content rating — G, PG, PG-13, R, and NC-17.",
  alternates: { canonical: "/movies/rated" },
};

const RATINGS = [
  { cert: "G", label: "General Audiences", desc: "Suitable for all ages" },
  { cert: "PG", label: "Parental Guidance", desc: "Some material may not be suitable for children" },
  { cert: "PG-13", label: "Parents Strongly Cautioned", desc: "Some material may be inappropriate for children under 13" },
  { cert: "R", label: "Restricted", desc: "Under 17 requires accompanying parent or adult guardian" },
  { cert: "NC-17", label: "Adults Only", desc: "No one 17 and under admitted" },
];

export default function MoviesByRatingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Browse Movies by Rating
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        US MPAA content ratings — see the{" "}
        <Link href="/reference/certifications">full certifications reference</Link> for other
        countries.
      </Typography>
      <Grid container spacing={2}>
        {RATINGS.map((r) => (
          <Grid key={r.cert} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              href={`/movies/rated/${r.cert}`}
              elevation={0}
              sx={{
                display: "block",
                p: 3,
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {r.cert}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {r.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
