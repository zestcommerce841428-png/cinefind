import Image from "next/image";
import Link from "@/components/common/NextLink";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import RatingBadge from "@/components/media/RatingBadge";
import { tmdbImage } from "@/lib/tmdb/config";
import type { MovieDetails, TvDetails } from "@/lib/tmdb/types";

type Title = MovieDetails | TvDetails;

function isMovie(t: Title): t is MovieDetails {
  return "title" in t;
}

function fmtMoney(n?: number) {
  if (!n) return "—";
  return `$${n.toLocaleString()}`;
}

function fmtRuntime(t: Title) {
  if (isMovie(t)) return t.runtime ? `${Math.floor(t.runtime / 60)}h ${t.runtime % 60}m` : "—";
  const avg = t.episode_run_time?.[0];
  return avg ? `${avg}m / episode` : "—";
}

function TitleCard({ title, id, mediaType }: { title: Title; id: number; mediaType: "movie" | "tv" }) {
  const name = isMovie(title) ? title.title : title.name;
  const date = isMovie(title) ? title.release_date : title.first_air_date;
  const poster = tmdbImage(title.poster_path, "w342");

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        component={Link}
        href={`/${mediaType}/${id}`}
        sx={{
          position: "relative",
          display: "block",
          aspectRatio: "2 / 3",
          maxWidth: 200,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "action.hover",
          mb: 1.5,
        }}
      >
        {poster && <Image src={poster} alt={name} fill sizes="200px" style={{ objectFit: "cover" }} />}
      </Box>
      <Typography
        component={Link}
        href={`/${mediaType}/${id}`}
        variant="h6"
        sx={{ fontWeight: 800, textDecoration: "none", color: "inherit", display: "block" }}
      >
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {date?.slice(0, 4)}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <RatingBadge voteAverage={title.vote_average} />
      </Box>
    </Box>
  );
}

const ROWS: {
  label: string;
  get: (t: Title) => React.ReactNode;
}[] = [
  { label: "Rating", get: (t) => `${t.vote_average.toFixed(1)} / 10 (${t.vote_count.toLocaleString()} votes)` },
  { label: "Popularity", get: (t) => t.popularity.toFixed(1) },
  { label: "Genres", get: (t) => t.genres.map((g) => g.name).join(", ") || "—" },
  { label: "Runtime", get: fmtRuntime },
  {
    label: "Budget",
    get: (t) => (isMovie(t) ? fmtMoney(t.budget) : "—"),
  },
  {
    label: "Revenue",
    get: (t) => (isMovie(t) ? fmtMoney(t.revenue) : "—"),
  },
  {
    label: "Seasons / Episodes",
    get: (t) => (!isMovie(t) ? `${t.number_of_seasons} seasons, ${t.number_of_episodes} episodes` : "—"),
  },
  { label: "Original Language", get: (t) => t.original_language.toUpperCase() },
  { label: "Status", get: (t) => t.status },
];

export default function CompareTable({
  a,
  b,
  aId,
  bId,
  mediaType,
}: {
  a: Title;
  b: Title;
  aId: number;
  bId: number;
  mediaType: "movie" | "tv";
}) {
  return (
    <Box>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6 }}>
          <TitleCard title={a} id={aId} mediaType={mediaType} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TitleCard title={b} id={bId} mediaType={mediaType} />
        </Grid>
      </Grid>

      <Table>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.label}>
              <TableCell sx={{ width: "35%", fontWeight: 700 }}>{row.label}</TableCell>
              <TableCell align="center">{row.get(a)}</TableCell>
              <TableCell align="center">{row.get(b)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
