import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";
import type { PaginatedResponse } from "@/lib/tmdb/types";

interface ListingPageProps {
  title: string;
  description?: string;
  basePath: string;
  data: PaginatedResponse<MovieSummary | TvSummary>;
  mediaType: "movie" | "tv";
  extraParams?: Record<string, string | undefined>;
  bare?: boolean;
}

export default function ListingPage({
  title,
  description,
  basePath,
  data,
  mediaType,
  extraParams = {},
  bare = false,
}: ListingPageProps) {
  const query = new URLSearchParams(
    Object.entries(extraParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  const body = (
    <>
      {title && (
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      <MediaGrid items={data.results} mediaType={mediaType} />

      {data.total_pages > 1 && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Pagination
            page={data.page}
            count={Math.min(data.total_pages, 500)}
            color="primary"
            renderItem={(item) => {
              const pageQuery = new URLSearchParams(query);
              pageQuery.set("page", String(item.page));
              return (
                <PaginationItem component={Link} href={`${basePath}?${pageQuery}`} {...item} />
              );
            }}
          />
        </Stack>
      )}
    </>
  );

  if (bare) return body;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {body}
    </Container>
  );
}
