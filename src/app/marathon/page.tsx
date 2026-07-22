import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MarathonPlanner from "@/components/media/MarathonPlanner";

export const metadata: Metadata = {
  title: "Marathon Planner",
  description: "Build a movie marathon and see how long it'll take, with a suggested schedule.",
  alternates: { canonical: "/marathon" },
};

export default function MarathonPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Marathon Planner
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Add movies from their detail pages with &quot;Add to Marathon&quot;, then come back here to see
        your total runtime and a suggested start-time schedule.
      </Typography>
      <MarathonPlanner />
    </Container>
  );
}
