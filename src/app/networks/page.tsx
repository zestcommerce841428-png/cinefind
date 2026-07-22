import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { getNetworkDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import { FEATURED_NETWORK_IDS } from "@/lib/networks";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "TV Networks & Streaming Originals",
  description: "Browse TV shows by network or streaming service — Netflix, HBO, Disney+, and more.",
  alternates: { canonical: "/networks" },
};

export default async function NetworksDirectoryPage() {
  const networks = await Promise.all(
    FEATURED_NETWORK_IDS.map((id) => getNetworkDetails(id).catch(() => null))
  );
  const valid = networks.filter((n): n is NonNullable<typeof n> => n !== null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        TV Networks &amp; Streaming Originals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Browse original programming from major broadcast networks and streaming services.
      </Typography>
      <Grid container spacing={2}>
        {valid.map((network) => (
          <Grid key={network.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card
              component={Link}
              href={`/network/${network.id}`}
              elevation={0}
              sx={{
                display: "block",
                p: 2.5,
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                height: "100%",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Stack sx={{ alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={tmdbImage(network.logo_path, "w185") ?? undefined}
                  variant="rounded"
                  sx={{ width: 64, height: 64, bgcolor: "#fff" }}
                />
                <Typography variant="body2" align="center" sx={{ fontWeight: 700 }}>
                  {network.name}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
