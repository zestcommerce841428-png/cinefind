import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SixDegreesFinder from "@/components/six-degrees/SixDegreesFinder";
import ShareButton from "@/components/media/ShareButton";

export const metadata: Metadata = {
  title: "Six Degrees of Separation",
  description: "Find how two actors are connected through shared movies and TV shows.",
  alternates: { canonical: "/six-degrees" },
};

export default function SixDegreesPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Six Degrees of Separation
        </Typography>
        <ShareButton title="Six Degrees of Separation — CineFind" text="Find how two actors are connected." />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Pick two actors and we&apos;ll search their most popular credits for a shared movie, TV show,
        or co-star that connects them.
      </Typography>
      <SixDegreesFinder />
    </Container>
  );
}
