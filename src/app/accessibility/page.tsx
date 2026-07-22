import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "CineFind's accessibility features and how to use them.",
  alternates: { canonical: "/accessibility" },
};

const FEATURES = [
  { title: "Text scaling", description: "Independent font-size, line-height, letter- and word-spacing controls." },
  { title: "Dyslexia-friendly font", description: "Swap body text to an OpenDyslexic-style typeface." },
  { title: "High contrast & inverted colors", description: "Boost contrast or invert the whole color scheme." },
  { title: "Color-vision simulation modes", description: "Protanopia, deuteranopia, and tritanopia-aware palettes." },
  { title: "Grayscale & sepia filters", description: "Reduce visual intensity for sensory comfort." },
  { title: "Reduced motion", description: "Pause carousels and disable animation, honoring your OS preference too." },
  { title: "Big cursor & big click targets", description: "Larger cursor and enlarged interactive tap areas." },
  { title: "Reading guide & reading mask", description: "A tracking line or spotlight to help focus while reading." },
  { title: "Keyboard focus ring", description: "A stronger, always-visible focus outline for keyboard navigation." },
  { title: "Underline & highlight links", description: "Make links and headings easier to spot at a glance." },
  { title: "Accessibility profiles", description: "One-click presets bundling several settings for common needs." },
];

export default function AccessibilityPage() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Accessibility
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Open the gear icon in the bottom-left corner of any page to access the full Accessibility
        &amp; Style Panel. Your choices are saved in this browser and applied instantly, site-wide.
      </Typography>

      <Grid container spacing={2}>
        {FEATURES.map((f) => (
          <Grid key={f.title} size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", height: "100%" }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{f.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {f.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Found something that doesn&apos;t work well with assistive technology? See the{" "}
        <a href="/about">About page</a> for how to reach us.
      </Typography>
    </Container>
  );
}
