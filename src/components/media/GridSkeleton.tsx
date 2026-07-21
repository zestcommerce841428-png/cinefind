import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" height={48} width="30%" sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: "2 / 3", borderRadius: 3, mb: 1 }} />
            <Skeleton variant="text" width="80%" />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
