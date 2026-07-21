import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, tips, and news about movies, TV shows, and CineFind.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Blog
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Guides, tips, and news about movies, TV shows, and CineFind. Subscribe via{" "}
        <a href="/blog/rss.xml">RSS</a>.
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid key={post.slug} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              href={`/blog/${post.slug}`}
              elevation={0}
              sx={{
                display: "block",
                height: "100%",
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, my: 1 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.description}
                </Typography>
                <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                  {post.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
