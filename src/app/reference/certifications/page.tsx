import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "@/components/common/NextLink";
import { getMovieCertifications, getTvCertifications } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Content Ratings & Certifications",
  description: "Movie and TV content rating systems by country (MPAA, BBFC, CBFC, FSK, and more).",
  alternates: { canonical: "/reference/certifications" },
};

const FEATURED = ["US", "GB", "IN", "DE", "FR", "JP", "KR", "AU", "CA", "BR"];

export default async function CertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const activeType = type === "tv" ? "tv" : "movie";
  const data =
    activeType === "tv" ? await getTvCertifications() : await getMovieCertifications();

  const countries = Object.keys(data.certifications).sort((a, b) => {
    const ai = FEATURED.indexOf(a);
    const bi = FEATURED.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Content Ratings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Official certification systems for {countries.length} countries.
      </Typography>

      <Tabs value={activeType} sx={{ mb: 3 }}>
        <Tab value="movie" label="Movies" component={Link} href="/reference/certifications?type=movie" />
        <Tab value="tv" label="TV Shows" component={Link} href="/reference/certifications?type=tv" />
      </Tabs>

      {countries.map((country) => (
        <Box key={country} component="section" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {country}
          </Typography>
          <Stack spacing={1}>
            {data.certifications[country]
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((cert) => (
                <Stack key={cert.certification} direction="row" sx={{ gap: 1.5, alignItems: "flex-start" }}>
                  {activeType === "movie" ? (
                    <Chip
                      component={Link}
                      href={`/certification/${country}/${encodeURIComponent(cert.certification)}`}
                      clickable
                      label={cert.certification}
                      size="small"
                      sx={{ fontWeight: 700, minWidth: 56 }}
                    />
                  ) : (
                    <Chip label={cert.certification} size="small" sx={{ fontWeight: 700, minWidth: 56 }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {cert.meaning}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Box>
      ))}
    </Container>
  );
}
