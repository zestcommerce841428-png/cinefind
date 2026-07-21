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
import MediaRow from "@/components/media/MediaRow";
import ActionButtons from "@/components/account/ActionButtons";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getSessionId } from "@/lib/session";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieSimilar,
  getMovieRecommendations,
  getMovieReviews,
  getMovieWatchProviders,
  getMovieKeywords,
  getMovieAccountStates,
} from "@/lib/tmdb";

export const revalidate = 3600;

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

async function loadMovie(id: string) {
  try {
    return await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getMovieVideos(id),
      getMovieSimilar(id),
      getMovieRecommendations(id),
      getMovieReviews(id),
      getMovieWatchProviders(id),
      getMovieKeywords(id),
    ]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadMovie(id);
  if (!data) return { title: "Movie Not Found" };
  const [movie] = data;
  const image = tmdbImage(movie.backdrop_path ?? movie.poster_path, "w780");

  return {
    title: `${movie.title} (${movie.release_date?.slice(0, 4) ?? "N/A"})`,
    description: movie.overview || `Details, cast, trailers, and reviews for ${movie.title}.`,
    alternates: { canonical: `/movie/${id}` },
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: image ? [{ url: image }] : undefined,
      type: "video.movie",
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const data = await loadMovie(id);
  if (!data) notFound();

  const [movie, credits, videos, similar, recommendations, reviews, watchProviders, keywords] = data;
  const sessionId = await getSessionId();
  const accountStates = sessionId
    ? await getMovieAccountStates(id, sessionId).catch(() => null)
    : null;
  const ratedValue =
    accountStates && typeof accountStates.rated === "object" ? accountStates.rated.value : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    datePublished: movie.release_date,
    image: tmdbImage(movie.poster_path, "w500"),
    aggregateRating: movie.vote_count
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
          bestRating: 10,
        }
      : undefined,
    genre: movie.genres.map((g) => g.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailHero
        title={movie.title}
        tagline={movie.tagline}
        overview={movie.overview}
        posterPath={movie.poster_path}
        backdropPath={movie.backdrop_path}
        voteAverage={movie.vote_average}
        releaseInfo={[
          movie.release_date?.slice(0, 4),
          movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null,
        ]
          .filter(Boolean)
          .join(" • ")}
        genres={movie.genres}
        metaChips={[movie.status]}
        actions={
          <ActionButtons
            mediaType="movie"
            mediaId={movie.id}
            isAuthenticated={!!sessionId}
            initialFavorite={accountStates?.favorite ?? false}
            initialWatchlist={accountStates?.watchlist ?? false}
            initialRating={ratedValue}
          />
        }
      />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <CastRow cast={credits.cast} seeAllHref={`/movie/${id}/cast`} />
            <VideoGallery videos={videos.results} seeAllHref={`/movie/${id}/videos`} />
            <ReviewList reviews={reviews.results} seeAllHref={`/movie/${id}/reviews`} />
            <MediaRow
              title="Similar Movies"
              items={similar.results}
              mediaType="movie"
              seeAllHref={`/movie/${id}/similar`}
            />
            <MediaRow
              title="Recommended For You"
              items={recommendations.results}
              mediaType="movie"
              seeAllHref={`/movie/${id}/recommendations`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <WatchProviders data={watchProviders} />

            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Facts
              </Typography>
              <Stack spacing={1}>
                <FactRow label="Status" value={movie.status} />
                <FactRow
                  label="Original Language"
                  value={movie.original_language?.toUpperCase()}
                />
                <FactRow label="Budget" value={movie.budget ? `$${movie.budget.toLocaleString()}` : "—"} />
                <FactRow label="Revenue" value={movie.revenue ? `$${movie.revenue.toLocaleString()}` : "—"} />
                {movie.homepage && (
                  <FactRow
                    label="Homepage"
                    value={
                      <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
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
                <Link href={`/movie/${id}/images`}>Images</Link>
                <Link href={`/movie/${id}/alternative-titles`}>Alternative Titles</Link>
                <Link href={`/movie/${id}/translations`}>Translations</Link>
                <Link href={`/movie/${id}/lists`}>Community Lists</Link>
                {movie.belongs_to_collection && (
                  <Link href={`/collection/${movie.belongs_to_collection.id}`}>
                    {movie.belongs_to_collection.name}
                  </Link>
                )}
              </Stack>
            </Box>

            {keywords.keywords?.length > 0 && (
              <Box component="section">
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Keywords
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {keywords.keywords.map((k) => (
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
