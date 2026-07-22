import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getMovieDetails } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadMovie(id: string) {
  try {
    return await getMovieDetails(id);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) return { title: "Not Found" };
  return {
    title: `${movie.title} — Budget & Box Office`,
    alternates: { canonical: `/movie/${id}/finance` },
  };
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value > 0 ? currency.format(value) : "Not disclosed"}
        </Typography>
      </Stack>
      <Box sx={{ height: 14, borderRadius: 2, bgcolor: "action.hover", overflow: "hidden" }}>
        <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: color, borderRadius: 2 }} />
      </Box>
    </Box>
  );
}

export default async function MovieFinancePage({ params }: PageProps) {
  const { id } = await params;
  const movie = await loadMovie(id);
  if (!movie) notFound();

  const { budget, revenue } = movie;
  const max = Math.max(budget, revenue, 1);
  const profit = revenue - budget;
  const roi = budget > 0 ? ((profit / budget) * 100).toFixed(0) : null;
  const hasData = budget > 0 || revenue > 0;

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={`/movie/${id}`}>{movie.title}</Link>
        <Typography color="text.primary">Budget &amp; Box Office</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Budget &amp; Box Office
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Figures reported by TMDB. Not every title discloses financial data to the studio.
      </Typography>

      {!hasData ? (
        <Typography color="text.secondary">
          No budget or box office figures are available for {movie.title}.
        </Typography>
      ) : (
        <Stack spacing={3}>
          <Bar label="Budget" value={budget} max={max} color="warning.main" />
          <Bar label="Worldwide Revenue" value={revenue} max={max} color="success.main" />
          {budget > 0 && revenue > 0 && (
            <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1">
                Net {profit >= 0 ? "profit" : "loss"}:{" "}
                <Box component="span" sx={{ fontWeight: 800, color: profit >= 0 ? "success.main" : "error.main" }}>
                  {currency.format(Math.abs(profit))}
                </Box>
              </Typography>
              {roi !== null && (
                <Typography variant="body2" color="text.secondary">
                  Return on budget: {roi}%
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      )}
    </Container>
  );
}
