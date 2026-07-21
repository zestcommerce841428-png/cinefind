import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getReviewDetails } from "@/lib/tmdb";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadReview(id: string) {
  try {
    return await getReviewDetails(id);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const review = await loadReview(id);
  if (!review) return { title: "Review Not Found" };
  return {
    title: `${review.author}'s review of ${review.media_title}`,
    description: review.content.slice(0, 160),
    alternates: { canonical: `/review/${id}` },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { id } = await params;
  const review = await loadReview(id);
  if (!review) notFound();

  const mediaHref = `/${review.media_type}/${review.media_id}`;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={mediaHref}>{review.media_title}</Link>
        <Typography color="text.primary">Review</Typography>
      </Breadcrumbs>

      <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 2 }}>
        <Avatar>{review.author.charAt(0)}</Avatar>
        <Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {review.author}
          </Typography>
          {typeof review.author_details.rating === "number" && (
            <Rating value={review.author_details.rating / 2} precision={0.5} size="small" readOnly />
          )}
        </Stack>
      </Stack>

      <Typography variant="body1" sx={{ whiteSpace: "pre-line", opacity: 0.9 }}>
        {review.content}
      </Typography>
    </Container>
  );
}
