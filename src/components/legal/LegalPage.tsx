import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {updated}
      </Typography>
      {sections.map((section) => (
        <Box key={section.heading} component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {section.heading}
          </Typography>
          {section.body.map((paragraph, i) => (
            <Typography key={i} variant="body1" sx={{ mb: 1.5, opacity: 0.9 }}>
              {paragraph}
            </Typography>
          ))}
        </Box>
      ))}
    </Container>
  );
}
