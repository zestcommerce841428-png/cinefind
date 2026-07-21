import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Link from "@/components/common/NextLink";
import MediaGrid from "@/components/media/MediaGrid";
import { getPopularPeople } from "@/lib/tmdb";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Popular People",
  description: "Browse popular actors, directors, and other film & TV industry figures.",
  alternates: { canonical: "/people" },
};

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const data = await getPopularPeople(Number(page) || 1);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Popular People
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Actors, directors, and other film & TV industry figures trending right now.
      </Typography>
      <MediaGrid items={data.results} mediaType="person" />

      {data.total_pages > 1 && (
        <Stack sx={{ alignItems: "center", mt: 4 }}>
          <Pagination
            page={data.page}
            count={Math.min(data.total_pages, 500)}
            color="primary"
            renderItem={(item) => (
              <PaginationItem component={Link} href={`/people?page=${item.page}`} {...item} />
            )}
          />
        </Stack>
      )}
    </Container>
  );
}
