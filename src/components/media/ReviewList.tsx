import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Link from "@/components/common/NextLink";
import type { Review } from "@/lib/tmdb/types";

export default function ReviewList({ reviews, seeAllHref }: { reviews: Review[]; seeAllHref?: string }) {
  if (!reviews?.length) return null;

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Reviews
        </Typography>
        {seeAllHref && reviews.length > 5 && (
          <Button component={Link} href={seeAllHref} size="small">
            See all
          </Button>
        )}
      </Stack>
      <Stack spacing={2}>
        {reviews.slice(0, 5).map((review) => (
          <Box key={review.id} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 1 }}>
              <Avatar
                src={
                  review.author_details.avatar_path?.startsWith("/https")
                    ? review.author_details.avatar_path.slice(1)
                    : review.author_details.avatar_path
                      ? `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                      : undefined
                }
                alt={review.author}
              >
                {review.author.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {review.author}
                </Typography>
                {typeof review.author_details.rating === "number" && (
                  <Rating value={review.author_details.rating / 2} precision={0.5} size="small" readOnly />
                )}
              </Box>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {review.content}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
