import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import type { Review } from "@/lib/tmdb/types";

export default function FullReviewsPage({
  title,
  backHref,
  reviews,
}: {
  title: string;
  backHref: string;
  reviews: Review[];
}) {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Reviews</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Reviews ({reviews.length})
      </Typography>

      {reviews.length === 0 && (
        <Typography color="text.secondary">No reviews yet for {title}.</Typography>
      )}

      <Stack spacing={3}>
        {reviews.map((review) => (
          <Box
            key={review.id}
            component={Link}
            href={`/review/${review.id}`}
            sx={{
              display: "block",
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Avatar>{review.author.charAt(0)}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {review.author}
                </Typography>
                {typeof review.author_details.rating === "number" && (
                  <Rating value={review.author_details.rating / 2} precision={0.5} size="small" readOnly />
                )}
              </Box>
            </Stack>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 8,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {review.content}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
