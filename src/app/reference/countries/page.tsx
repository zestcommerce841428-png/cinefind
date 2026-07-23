import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CountryExplorer from "@/components/reference/CountryExplorer";
import { getCountries } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Supported Countries & Regions",
  description: "All countries and regions supported by the TMDB catalog.",
  alternates: { canonical: "/reference/countries" },
};

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Countries & Regions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {countries.length} countries and regions used for release dates, certifications, and watch
        provider availability. Click any country to browse movies produced there.
      </Typography>
      <CountryExplorer countries={countries} />
    </Container>
  );
}
