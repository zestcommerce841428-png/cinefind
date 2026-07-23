import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LanguageExplorer from "@/components/reference/LanguageExplorer";
import { getLanguages } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Supported Languages",
  description: "All languages supported by the TMDB catalog.",
  alternates: { canonical: "/reference/languages" },
};

export default async function LanguagesPage() {
  const languages = await getLanguages();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Supported Languages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {languages.length} languages available across the TMDB catalog. Click any language to browse
        movies made in it.
      </Typography>
      <LanguageExplorer languages={languages} />
    </Container>
  );
}
