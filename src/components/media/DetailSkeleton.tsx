import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function DetailSkeleton() {
  return (
    <Box>
      <Skeleton variant="rectangular" height={320} sx={{ mb: 0 }} />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="text" height={48} width="60%" sx={{ mb: 2 }} />
            <Stack direction="row" sx={{ gap: 2, mb: 3 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={110} height={140} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
            <Skeleton variant="text" height={32} width="30%" sx={{ mb: 2 }} />
            <Stack direction="row" sx={{ gap: 2 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={260} height={146} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
