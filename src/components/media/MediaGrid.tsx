import Grid from "@mui/material/Grid";
import MediaCard from "./MediaCard";
import type { MovieSummary, PersonSummary, TvSummary } from "@/lib/tmdb/types";

interface MediaGridProps {
  items: (MovieSummary | TvSummary | PersonSummary)[];
  mediaType?: "movie" | "tv" | "person";
}

export default function MediaGrid({ items, mediaType }: MediaGridProps) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => {
        const resolvedType = mediaType ?? item.media_type ?? "movie";
        const isMovie = resolvedType === "movie";
        const isPerson = resolvedType === "person";
        const movieItem = item as MovieSummary;
        const tvItem = item as TvSummary;
        const personItem = item as PersonSummary;

        const title = isPerson ? personItem.name : isMovie ? movieItem.title : tvItem.name;
        const subtitle = isPerson
          ? personItem.known_for_department
          : isMovie
            ? movieItem.release_date?.slice(0, 4)
            : tvItem.first_air_date?.slice(0, 4);
        const posterPath = isPerson ? personItem.profile_path : (movieItem.poster_path ?? null);

        return (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <MediaCard
              id={item.id}
              title={title}
              subtitle={subtitle}
              posterPath={posterPath}
              voteAverage={isPerson ? undefined : movieItem.vote_average}
              mediaType={resolvedType}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
