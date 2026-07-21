import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

export default function FullMediaListPage({
  title,
  backHref,
  pageLabel,
  items,
  mediaType,
}: {
  title: string;
  backHref: string;
  pageLabel: string;
  items: (MovieSummary | TvSummary)[];
  mediaType: "movie" | "tv";
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">{pageLabel}</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {pageLabel}
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">Nothing found.</Typography>
      ) : (
        <MediaGrid items={items} mediaType={mediaType} />
      )}
    </Container>
  );
}
