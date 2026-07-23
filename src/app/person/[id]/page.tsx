import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import {
  getPersonDetails,
  getPersonCombinedCredits,
  getPersonExternalIds,
  getMovieGenres,
  getTvGenres,
} from "@/lib/tmdb";
import MediaGrid from "@/components/media/MediaGrid";
import BreadcrumbJsonLd from "@/components/common/BreadcrumbJsonLd";
import FilmographyTimeline from "@/components/detail/FilmographyTimeline";
import FilmographyDecadeHeatmap from "@/components/detail/FilmographyDecadeHeatmap";
import GenreFingerprint from "@/components/detail/GenreFingerprint";
import DirectorRatingTrend from "@/components/detail/DirectorRatingTrend";
import FrequentCoStars from "@/components/detail/FrequentCoStars";
import ShareButton from "@/components/media/ShareButton";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

async function loadPerson(id: string) {
  try {
    return await Promise.all([
      getPersonDetails(id),
      getPersonCombinedCredits(id),
      getPersonExternalIds(id),
      getMovieGenres(),
      getTvGenres(),
    ]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadPerson(id);
  if (!data) return { title: "Person Not Found" };
  const [person] = data;
  return {
    title: person.name,
    description:
      person.biography?.slice(0, 160) || `Filmography, biography, and photos for ${person.name}.`,
    alternates: { canonical: `/person/${id}` },
    openGraph: {
      title: person.name,
      images: person.profile_path ? [{ url: tmdbImage(person.profile_path, "w500")! }] : undefined,
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const data = await loadPerson(id);
  if (!data) notFound();
  const [person, credits, externalIds, movieGenres, tvGenres] = data;

  const knownFor = [...credits.cast, ...credits.crew]
    .sort((a, b) => b.popularity - a.popularity)
    .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id && x.media_type === v.media_type) === i)
    .slice(0, 18);

  const genreNameMap = new Map<number, string>([
    ...movieGenres.genres.map((g) => [g.id, g.name] as const),
    ...tvGenres.genres.map((g) => [g.id, g.name] as const),
  ]);
  const uniqueCastCredits = credits.cast.filter(
    (v, i, arr) => arr.findIndex((x) => x.id === v.id && x.media_type === v.media_type) === i
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.biography,
    birthDate: person.birthday,
    image: tmdbImage(person.profile_path, "w500"),
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "People", path: "/people" },
          { name: person.name, path: `/person/${id}` },
        ]}
      />
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Box
            sx={{
              position: "relative",
              aspectRatio: "2 / 3",
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "action.hover",
              mb: 3,
            }}
          >
            {person.profile_path && (
              <Image
                src={tmdbImage(person.profile_path, "w500")!}
                alt={person.name}
                fill
                sizes="300px"
                style={{ objectFit: "cover" }}
                priority
              />
            )}
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Personal Info
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <InfoBlock label="Known For" value={person.known_for_department} />
            <InfoBlock
              label="Gender"
              value={["Not specified", "Female", "Male", "Non-binary"][person.gender] ?? "—"}
            />
            <InfoBlock label="Birthday" value={person.birthday} />
            {person.deathday && <InfoBlock label="Died" value={person.deathday} />}
            <InfoBlock label="Place of Birth" value={person.place_of_birth} />
            {person.also_known_as?.length > 0 && (
              <InfoBlock label="Also Known As" value={person.also_known_as.join(", ")} />
            )}
          </Stack>

          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {externalIds.imdb_id && (
              <Chip
                component="a"
                href={`https://www.imdb.com/name/${externalIds.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                label="IMDb"
                clickable
                size="small"
              />
            )}
            {externalIds.instagram_id && (
              <Chip
                component="a"
                href={`https://instagram.com/${externalIds.instagram_id}`}
                target="_blank"
                rel="noopener noreferrer"
                label="Instagram"
                clickable
                size="small"
              />
            )}
            {externalIds.twitter_id && (
              <Chip
                component="a"
                href={`https://x.com/${externalIds.twitter_id}`}
                target="_blank"
                rel="noopener noreferrer"
                label="X / Twitter"
                clickable
                size="small"
              />
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 40 } }}>
              {person.name}
            </Typography>
            <ShareButton title={`${person.name} — CineFind`} text={person.biography?.slice(0, 160)} />
          </Box>

          {person.biography && (
            <Box component="section" sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Biography
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-line", maxWidth: 760, opacity: 0.9 }}
              >
                {person.biography}
              </Typography>
            </Box>
          )}

          <Box component="section" sx={{ mb: 5 }}>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Known For
              </Typography>
              <Button component={Link} href={`/person/${id}/credits`} size="small">
                Full Filmography
              </Button>
            </Stack>
            <MediaGrid items={knownFor as (MovieSummary | TvSummary)[]} />
          </Box>

          <GenreFingerprint items={uniqueCastCredits as (MovieSummary | TvSummary)[]} genreNames={genreNameMap} />
          <FilmographyTimeline items={uniqueCastCredits as (MovieSummary | TvSummary)[]} />
          <FilmographyDecadeHeatmap items={uniqueCastCredits as (MovieSummary | TvSummary)[]} />
          <DirectorRatingTrend crew={credits.crew as ((MovieSummary | TvSummary) & { job: string })[]} />
          <FrequentCoStars
            personId={person.id}
            credits={uniqueCastCredits as ((MovieSummary | TvSummary) & { media_type: "movie" | "tv" })[]}
          />

          <Button component={Link} href={`/person/${id}/images`} variant="outlined" size="small">
            View Photos
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
