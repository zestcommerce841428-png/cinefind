import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@/components/common/NextLink";
import MediaCard from "./MediaCard";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

interface MediaRowProps {
  title: string;
  items: (MovieSummary | TvSummary)[];
  mediaType: "movie" | "tv";
  seeAllHref?: string;
}

export default function MediaRow({ title, items, mediaType, seeAllHref }: MediaRowProps) {
  if (!items?.length) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {seeAllHref && (
          <Button component={Link} href={seeAllHref} size="small">
            See all
          </Button>
        )}
      </Stack>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": { height: 6 },
        }}
      >
        {items.map((item) => {
          const isMovie = mediaType === "movie";
          const movieItem = item as MovieSummary;
          const tvItem = item as TvSummary;
          return (
            <Box
              key={item.id}
              sx={{ flex: "0 0 auto", width: { xs: 140, sm: 170, md: 190 }, scrollSnapAlign: "start" }}
            >
              <MediaCard
                id={item.id}
                title={isMovie ? movieItem.title : tvItem.name}
                subtitle={
                  isMovie
                    ? movieItem.release_date?.slice(0, 4)
                    : tvItem.first_air_date?.slice(0, 4)
                }
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                mediaType={mediaType}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
