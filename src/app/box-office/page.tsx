import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Link from "@/components/common/NextLink";
import ShareButton from "@/components/media/ShareButton";
import { discoverMovies, getMovieDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 21600;
export const metadata: Metadata = {
  title: "Box Office Leaderboard",
  description: "The highest-grossing and best-ROI movies, ranked by real budget and revenue data.",
  alternates: { canonical: "/box-office" },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function BoxOfficePage({ searchParams }: PageProps) {
  const { sort } = await searchParams;
  const mode = sort === "roi" ? "roi" : "revenue";

  const candidates = await discoverMovies({
    sort_by: "revenue.desc",
    "vote_count.gte": 200,
  });

  const details = await Promise.all(
    candidates.results.slice(0, 20).map((m) => getMovieDetails(m.id).catch(() => null))
  );

  const rows = details
    .filter((d): d is NonNullable<typeof d> => d !== null && d.revenue > 0)
    .map((d) => ({
      id: d.id,
      title: d.title,
      posterPath: d.poster_path,
      year: d.release_date?.slice(0, 4),
      budget: d.budget,
      revenue: d.revenue,
      roi: d.budget > 0 ? d.revenue / d.budget : null,
    }));

  const sorted = [...rows].sort((a, b) => {
    if (mode === "roi") {
      if (a.roi === null) return 1;
      if (b.roi === null) return -1;
      return b.roi - a.roi;
    }
    return b.revenue - a.revenue;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Box Office Leaderboard
        </Typography>
        <ShareButton title="Box Office Leaderboard — CineFind" text="Real budget vs. revenue, sortable by ROI." />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real budget and revenue figures from currently popular, high-vote-count releases.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip
          label="By Revenue"
          component={Link}
          href="/box-office?sort=revenue"
          clickable
          color={mode === "revenue" ? "secondary" : "default"}
        />
        <Chip
          label="By ROI (Revenue ÷ Budget)"
          component={Link}
          href="/box-office?sort=roi"
          clickable
          color={mode === "roi" ? "secondary" : "default"}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Budget</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">ROI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((row, i) => (
              <TableRow key={row.id} hover component={Link} href={`/movie/${row.id}`} sx={{ textDecoration: "none" }}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={tmdbImage(row.posterPath, "w92") ?? undefined}
                      variant="rounded"
                      sx={{ width: 32, height: 48 }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {row.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.year}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">{row.budget > 0 ? currency.format(row.budget) : "—"}</TableCell>
                <TableCell align="right">{currency.format(row.revenue)}</TableCell>
                <TableCell align="right">{row.roi !== null ? `${row.roi.toFixed(1)}×` : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
