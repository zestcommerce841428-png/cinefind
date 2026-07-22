import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import WatchPartyBuilder from "@/components/watchparty/WatchPartyBuilder";

export const metadata: Metadata = {
  title: "Watch Party Picker",
  description: "Add a few movies each person likes, and find something everyone in the group will enjoy.",
  alternates: { canonical: "/watch-party" },
};

export default function WatchPartyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Watch Party Picker
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Add a few movies each person likes, and we&apos;ll find common ground for the whole group.
      </Typography>
      <WatchPartyBuilder />
    </Container>
  );
}
