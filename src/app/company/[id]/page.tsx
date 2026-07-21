import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCompanyDetails, discoverMovies } from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";

export const revalidate = 3600;

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

async function loadCompany(id: string) {
  try {
    return await Promise.all([getCompanyDetails(id), discoverMovies({ with_companies: id })]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadCompany(id);
  if (!data) return { title: "Company Not Found" };
  const [company] = data;
  return {
    title: company.name,
    description: company.description || `Movies produced by ${company.name}.`,
    alternates: { canonical: `/company/${id}` },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;
  const data = await loadCompany(id);
  if (!data) notFound();
  const [company, movies] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", gap: 2, mb: 3 }}>
        {company.logo_path && (
          <Avatar
            src={tmdbImage(company.logo_path, "w185") ?? undefined}
            variant="rounded"
            sx={{ width: 72, height: 72, bgcolor: "#fff" }}
          />
        )}
        <Stack>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {company.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {company.headquarters}
          </Typography>
        </Stack>
      </Stack>
      {company.description && (
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 760 }}>
          {company.description}
        </Typography>
      )}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Movies
      </Typography>
      <MediaGrid items={movies.results} mediaType="movie" />
    </Container>
  );
}
