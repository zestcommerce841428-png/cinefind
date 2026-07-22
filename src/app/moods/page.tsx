import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Link from "@/components/common/NextLink";
import { MOODS } from "@/lib/moods";

export const metadata: Metadata = {
  title: "Browse by Mood",
  description: "Find something to watch based on your mood — cozy, spooky, mind-bending, and more.",
  alternates: { canonical: "/moods" },
};

export default function MoodsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Browse by Mood
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Curated genre combinations for when you know how you want to feel, not what you want to search.
      </Typography>
      <Grid container spacing={2}>
        {MOODS.map((mood) => (
          <Grid key={mood.slug} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardActionArea component={Link} href={`/moods/${mood.slug}`} sx={{ height: "100%", p: 1 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 36, mb: 1 }}>{mood.emoji}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {mood.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mood.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
