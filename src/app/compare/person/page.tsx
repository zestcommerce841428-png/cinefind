import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Link from "@/components/common/NextLink";
import ComparePickerForm from "@/components/compare/ComparePickerForm";
import { getPersonDetails, getPersonCombinedCredits } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Compare Actors",
  description: "Compare two actors side by side — popularity, filmography size, and top genres.",
  alternates: { canonical: "/compare/person" },
};

interface PageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

async function loadPerson(id: string) {
  const [details, credits] = await Promise.all([getPersonDetails(id), getPersonCombinedCredits(id)]);
  const uniqueCredits = credits.cast.filter(
    (v, i, arr) => arr.findIndex((x) => x.id === v.id && x.media_type === v.media_type) === i
  );
  const avgRating =
    uniqueCredits.length > 0
      ? uniqueCredits.reduce((sum, c) => sum + c.vote_average, 0) / uniqueCredits.length
      : 0;
  const movieCount = uniqueCredits.filter((c) => c.media_type === "movie").length;
  const tvCount = uniqueCredits.filter((c) => c.media_type === "tv").length;
  return { details, movieCount, tvCount, avgRating };
}

function PersonCard({ data, id }: { data: Awaited<ReturnType<typeof loadPerson>>; id: string }) {
  const photo = tmdbImage(data.details.profile_path, "w342");
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        component={Link}
        href={`/person/${id}`}
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
        {photo && <Image src={photo} alt={data.details.name} fill sizes="200px" style={{ objectFit: "cover" }} />}
      </Box>
      <Typography
        component={Link}
        href={`/person/${id}`}
        variant="h6"
        sx={{ fontWeight: 800, textDecoration: "none", color: "inherit", display: "block" }}
      >
        {data.details.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.details.known_for_department}
      </Typography>
    </Box>
  );
}

export default async function ComparePersonPage({ searchParams }: PageProps) {
  const { a, b } = await searchParams;

  let table = null;
  if (a && b) {
    const [personA, personB] = await Promise.all([loadPerson(a), loadPerson(b)]);
    const rows: { label: string; get: (d: Awaited<ReturnType<typeof loadPerson>>) => React.ReactNode }[] = [
      { label: "Popularity", get: (d) => d.details.popularity.toFixed(1) },
      { label: "Movie Credits", get: (d) => d.movieCount.toLocaleString() },
      { label: "TV Credits", get: (d) => d.tvCount.toLocaleString() },
      { label: "Avg. Rating of Credits", get: (d) => `${d.avgRating.toFixed(1)} / 10` },
      { label: "Birthday", get: (d) => d.details.birthday ?? "—" },
      { label: "Place of Birth", get: (d) => d.details.place_of_birth ?? "—" },
    ];
    table = (
      <Box>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={6}>
            <PersonCard data={personA} id={a} />
          </Grid>
          <Grid size={6}>
            <PersonCard data={personB} id={b} />
          </Grid>
        </Grid>
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell sx={{ width: "35%", fontWeight: 700 }}>{row.label}</TableCell>
                <TableCell align="center">{row.get(personA)}</TableCell>
                <TableCell align="center">{row.get(personB)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Compare Actors
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Pick two actors to compare popularity, filmography size, and average rating of their work.
      </Typography>
      <ComparePickerForm kind="person" />
      {table}
    </Container>
  );
}
