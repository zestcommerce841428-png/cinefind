import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WatchPartyBuilder from "@/components/watchparty/WatchPartyBuilder";
import ShareButton from "@/components/media/ShareButton";

export const metadata: Metadata = {
  title: "Watch Party Picker",
  description: "Add a few movies each person likes, and find something everyone in the group will enjoy.",
  alternates: { canonical: "/watch-party" },
};

export default function WatchPartyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Watch Party Picker
        </Typography>
        <ShareButton title="Watch Party Picker — CineFind" text="Find something everyone in the group will enjoy." />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Add a few movies each person likes, and we&apos;ll find common ground for the whole group.
      </Typography>
      <WatchPartyBuilder />
    </Container>
  );
}
