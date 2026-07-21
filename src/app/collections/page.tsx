import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "@/components/common/NextLink";
import SearchBox from "@/app/search/SearchBox";
import { searchCollections } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Movie Collections",
  description: "Search movie franchises and collections, from trilogies to shared universes.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const data = query ? await searchCollections(query) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Movie Collections
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Search franchises and collections — trilogies, shared universes, and more.
      </Typography>

      <SearchBox initialQuery={query} basePath="/collections" placeholder="Search collections..." />

      {data && (
        <Grid container spacing={2}>
          {data.results.map((collection) => (
            <Grid key={collection.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                component={Link}
                href={`/collection/${collection.id}`}
                elevation={0}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <Box sx={{ position: "relative", width: 70, aspectRatio: "2 / 3", flexShrink: 0, borderRadius: 1, overflow: "hidden", bgcolor: "action.hover" }}>
                  {collection.poster_path && (
                    <Image
                      src={tmdbImage(collection.poster_path, "w185")!}
                      alt={collection.name}
                      fill
                      sizes="70px"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {collection.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
