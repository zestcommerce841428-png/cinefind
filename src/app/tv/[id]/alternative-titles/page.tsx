import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getTvDetails, getTvAlternativeTitles } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getTvDetails(id), getTvAlternativeTitles(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [tv] = data;
  return {
    title: `${tv.name} — Alternative Titles`,
    alternates: { canonical: `/tv/${id}/alternative-titles` },
  };
}

export default async function TvAlternativeTitlesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [tv, alt] = data;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/tv/${id}`}>{tv.name}</Link>
        <Typography color="text.primary">Alternative Titles</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Alternative Titles
      </Typography>
      {alt.results.length === 0 ? (
        <Typography color="text.secondary">No alternative titles found.</Typography>
      ) : (
        <Table size="small">
          <TableBody>
            {alt.results.map((t, i) => (
              <TableRow key={`${t.iso_3166_1}-${i}`}>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>{t.iso_3166_1}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{t.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
