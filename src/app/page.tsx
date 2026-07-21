import Container from "@mui/material/Container";
import HeroCarousel from "@/components/media/HeroCarousel";
import MediaRow from "@/components/media/MediaRow";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTv,
  getTopRatedTv,
  getAiringTodayTv,
} from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export const revalidate = 3600;

export default async function HomePage() {
  const [
    trending,
    popularMovies,
    topRatedMovies,
    nowPlaying,
    upcoming,
    popularTv,
    topRatedTv,
    airingToday,
  ] = await Promise.all([
    getTrending("movie", "day"),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getPopularTv(),
    getTopRatedTv(),
    getAiringTodayTv(),
  ]);

  return (
    <>
      <HeroCarousel items={trending.results as MovieSummary[]} />
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <MediaRow
          title="Trending Today"
          items={trending.results as MovieSummary[]}
          mediaType="movie"
          seeAllHref="/movies/discover"
        />
        <MediaRow
          title="Popular Movies"
          items={popularMovies.results}
          mediaType="movie"
          seeAllHref="/movies/popular"
        />
        <MediaRow
          title="Now Playing in Theaters"
          items={nowPlaying.results}
          mediaType="movie"
          seeAllHref="/movies/now-playing"
        />
        <MediaRow
          title="Top Rated Movies"
          items={topRatedMovies.results}
          mediaType="movie"
          seeAllHref="/movies/top-rated"
        />
        <MediaRow
          title="Upcoming Releases"
          items={upcoming.results}
          mediaType="movie"
          seeAllHref="/movies/upcoming"
        />
        <MediaRow
          title="Popular TV Shows"
          items={popularTv.results as TvSummary[]}
          mediaType="tv"
          seeAllHref="/tv/popular"
        />
        <MediaRow
          title="Top Rated TV Shows"
          items={topRatedTv.results as TvSummary[]}
          mediaType="tv"
          seeAllHref="/tv/top-rated"
        />
        <MediaRow
          title="Airing Today"
          items={airingToday.results as TvSummary[]}
          mediaType="tv"
          seeAllHref="/tv/airing-today"
        />
      </Container>
    </>
  );
}
