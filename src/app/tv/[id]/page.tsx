import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DetailHero from "@/components/media/DetailHero";
import CastRow from "@/components/media/CastRow";
import VideoGallery from "@/components/media/VideoGallery";
import WatchProviders from "@/components/media/WatchProviders";
import ReviewList from "@/components/media/ReviewList";
import SeasonList from "@/components/media/SeasonList";
import MediaRow from "@/components/media/MediaRow";
import ActionButtons from "@/components/account/ActionButtons";
import EmbedWidget from "@/components/media/EmbedWidget";
import ShareButton from "@/components/media/ShareButton";
import BreadcrumbJsonLd from "@/components/common/BreadcrumbJsonLd";
import RecentlyViewedRecorder from "@/components/media/RecentlyViewedRecorder";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getSessionId } from "@/lib/session";
import {
  getTvDetails,
  getTvCredits,
  getTvVideos,
  getTvSimilar,
  getTvRecommendations,
  getTvReviews,
  getTvWatchProviders,
  getTvKeywords,
  getTvContentRatings,
  getTvAccountStates,
} from "@/lib/tmdb";

export const revalidate = 3600;

interface TvPageProps {
  params: Promise<{ id: string }>;
}

async function loadTv(id: string) {
  try {
    return await Promise.all([
      getTvDetails(id),
      getTvCredits(id),
      getTvVideos(id),
      getTvSimilar(id),
      getTvRecommendations(id),
      getTvReviews(id),
      getTvWatchProviders(id),
      getTvKeywords(id),
      getTvContentRatings(id),
    ]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: TvPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadTv(id);
  if (!data) return { title: "TV Show Not Found" };
  const [tv] = data;
  const image = tmdbImage(tv.backdrop_path ?? tv.poster_path, "w780");

  return {
    title: `${tv.name} (${tv.first_air_date?.slice(0, 4) ?? "N/A"})`,
    description: tv.overview || `Details, cast, seasons, and reviews for ${tv.name}.`,
    alternates: { canonical: `/tv/${id}` },
    openGraph: {
      title: tv.name,
      description: tv.overview,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
  };
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  const data = await loadTv(id);
  if (!data) notFound();

  const [tv, credits, videos, similar, recommendations, reviews, watchProviders, keywords, ratings] = data;

  const usRating = ratings.results.find((r) => r.iso_3166_1 === "US")?.rating;
  const sessionId = await getSessionId();
  const accountStates = sessionId ? await getTvAccountStates(id, sessionId).catch(() => null) : null;
  const ratedValue =
    accountStates && typeof accountStates.rated === "object" ? accountStates.rated.value : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: tv.name,
    description: tv.overview,
    datePublished: tv.first_air_date,
    image: tmdbImage(tv.poster_path, "w500"),
    numberOfSeasons: tv.number_of_seasons,
    numberOfEpisodes: tv.number_of_episodes,
    aggregateRating: tv.vote_count
      ? {
          "@type": "AggregateRating",
          ratingValue: tv.vote_average,
          ratingCount: tv.vote_count,
          bestRating: 10,
        }
      : undefined,
    genre: tv.genres.map((g) => g.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "TV Shows", path: "/tv" },
          { name: tv.name, path: `/tv/${id}` },
        ]}
      />
      <RecentlyViewedRecorder
        id={tv.id}
        mediaType="tv"
        title={tv.name}
        posterPath={tv.poster_path}
        voteAverage={tv.vote_average}
      />
      <DetailHero
        title={tv.name}
        tagline={tv.tagline}
        overview={tv.overview}
        posterPath={tv.poster_path}
        backdropPath={tv.backdrop_path}
        voteAverage={tv.vote_average}
        releaseInfo={[
          tv.first_air_date?.slice(0, 4),
          tv.last_air_date && tv.last_air_date !== tv.first_air_date
            ? `– ${tv.last_air_date.slice(0, 4)}`
            : "",
          `${tv.number_of_seasons} season${tv.number_of_seasons === 1 ? "" : "s"}`,
        ]
          .filter(Boolean)
          .join(" ")}
        genres={tv.genres}
        metaChips={[tv.status, usRating].filter(Boolean) as string[]}
        actions={
          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
            <ActionButtons
              mediaType="tv"
              mediaId={tv.id}
              isAuthenticated={!!sessionId}
              initialFavorite={accountStates?.favorite ?? false}
              initialWatchlist={accountStates?.watchlist ?? false}
              initialRating={ratedValue}
            />
            <ShareButton title={tv.name} text={tv.overview} />
          </Stack>
        }
      />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SeasonList tvId={tv.id} seasons={tv.seasons} />
            <CastRow cast={credits.cast} seeAllHref={`/tv/${id}/cast`} />
            <VideoGallery videos={videos.results} seeAllHref={`/tv/${id}/videos`} />
            <ReviewList reviews={reviews.results} seeAllHref={`/tv/${id}/reviews`} />
            <MediaRow
              title="Similar Shows"
              items={similar.results}
              mediaType="tv"
              seeAllHref={`/tv/${id}/similar`}
            />
            <MediaRow
              title="Recommended For You"
              items={recommendations.results}
              mediaType="tv"
              seeAllHref={`/tv/${id}/recommendations`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <WatchProviders data={watchProviders} />

            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Facts
              </Typography>
              <Stack spacing={1}>
                <FactRow label="Status" value={tv.status} />
                <FactRow label="Type" value={tv.type} />
                <FactRow label="Episodes" value={tv.number_of_episodes} />
                <FactRow
                  label="Networks"
                  value={tv.networks?.map((n) => n.name).join(", ") || "—"}
                />
                {tv.homepage && (
                  <FactRow
                    label="Homepage"
                    value={
                      <a href={tv.homepage} target="_blank" rel="noopener noreferrer">
                        Visit site
                      </a>
                    }
                  />
                )}
              </Stack>
            </Box>

            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                More
              </Typography>
              <Stack spacing={0.75}>
                <Link href={`/tv/${id}/images`}>Images</Link>
                <Link href={`/tv/${id}/alternative-titles`}>Alternative Titles</Link>
                <Link href={`/tv/${id}/translations`}>Translations</Link>
                <Link href={`/tv/${id}/episode-groups`}>Episode Groups</Link>
                <Link href={`/tv/${id}/content-ratings`}>Content Ratings</Link>
                <Link href={`/tv/${id}/watch`}>Where to Watch (all regions)</Link>
              </Stack>
            </Box>

            <EmbedWidget mediaType="tv" id={tv.id} />

            {keywords.results?.length > 0 && (
              <Box component="section">
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Keywords
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {keywords.results.map((k) => (
                    <Chip
                      key={k.id}
                      component={Link}
                      href={`/keyword/${k.id}`}
                      label={k.name}
                      size="small"
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}
