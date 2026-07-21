import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getCreditDetails } from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadCredit(id: string) {
  try {
    return await getCreditDetails(id);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const credit = await loadCredit(id);
  if (!credit) return { title: "Credit Not Found" };
  const mediaTitle =
    (credit.media as MovieSummary).title ?? (credit.media as TvSummary).name ?? "Unknown";
  return {
    title: `${credit.person.name} in ${mediaTitle}`,
    alternates: { canonical: `/credit/${id}` },
  };
}

export default async function CreditPage({ params }: PageProps) {
  const { id } = await params;
  const credit = await loadCredit(id);
  if (!credit) notFound();

  const mediaTitle =
    (credit.media as MovieSummary).title ?? (credit.media as TvSummary).name ?? "Unknown";
  const role = credit.media.character || credit.job || credit.department;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="overline" color="text.secondary">
        Credit Record
      </Typography>
      <Stack direction="row" sx={{ alignItems: "center", gap: 2, my: 2 }}>
        <Avatar
          src={tmdbImage(credit.person.profile_path, "w185") ?? undefined}
          sx={{ width: 72, height: 72 }}
        >
          {credit.person.name.charAt(0)}
        </Avatar>
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {credit.person.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role ? `as ${role}` : credit.department} in {mediaTitle}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ gap: 1, mb: 3, flexWrap: "wrap" }}>
        <Chip label={credit.credit_type} size="small" />
        {credit.department && <Chip label={credit.department} size="small" variant="outlined" />}
      </Stack>
      <Stack direction="row" sx={{ gap: 1.5 }}>
        <Button component={Link} href={`/person/${credit.person.id}`} variant="contained">
          View Person
        </Button>
        <Button component={Link} href={`/${credit.media_type}/${credit.media.id}`} variant="outlined">
          View {credit.media_type === "movie" ? "Movie" : "Show"}
        </Button>
      </Stack>
    </Container>
  );
}
