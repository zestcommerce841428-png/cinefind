import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

export default function PageSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Skeleton variant="text" width={280} height={48} sx={{ mb: 1 }} />
      <Skeleton variant="text" width={420} height={24} sx={{ mb: 4 }} />
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <Skeleton variant="rounded" height={12} />
        <Skeleton variant="rounded" height={12} width="90%" />
        <Skeleton variant="rounded" height={12} width="75%" />
      </Stack>
      <Grid container spacing={2}>
        {Array.from({ length: cards }, (_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <Skeleton variant="rounded" height={180} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
