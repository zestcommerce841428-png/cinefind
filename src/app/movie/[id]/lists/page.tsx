import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails, getMovieLists } from "@/lib/tmdb";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadData(id: string) {
  try {
    return await Promise.all([getMovieDetails(id), getMovieLists(id)]);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) return { title: "Not Found" };
  const [movie] = data;
  return {
    title: `Lists featuring ${movie.title}`,
    alternates: { canonical: `/movie/${id}/lists` },
  };
}

export default async function MovieListsPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadData(id);
  if (!data) notFound();
  const [movie, lists] = data;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/movie/${id}`}>{movie.title}</Link>
        <Typography color="text.primary">Lists</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Community Lists
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        TMDB user-curated lists that include {movie.title}.
      </Typography>

      {lists.results.length === 0 ? (
        <Typography color="text.secondary">No public lists include this movie yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {lists.results.map((list) => (
            <Grid key={list.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {list.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  {list.item_count} items
                </Typography>
                {list.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {list.description}
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
