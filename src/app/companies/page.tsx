import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Link from "@/components/common/NextLink";
import SearchBox from "@/app/search/SearchBox";
import { searchCompanies } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Production Companies",
  description: "Search production companies and studios, and browse their filmography.",
  alternates: { canonical: "/companies" },
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const data = query ? await searchCompanies(query) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Production Companies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Search studios and production companies.
      </Typography>

      <SearchBox initialQuery={query} basePath="/companies" placeholder="Search companies..." />

      {data && (
        <Grid container spacing={2}>
          {data.results.map((company) => (
            <Grid key={company.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                component={Link}
                href={`/company/${company.id}`}
                elevation={0}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  p: 2,
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Avatar
                  src={tmdbImage(company.logo_path, "w92") ?? undefined}
                  variant="rounded"
                  sx={{ width: 48, height: 48, bgcolor: "#fff" }}
                >
                  {company.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {company.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
