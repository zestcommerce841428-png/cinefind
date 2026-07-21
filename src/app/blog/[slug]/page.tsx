import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mt: 4, mb: 1.5 }} {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mt: 3, mb: 1 }} {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }} {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <Typography component="li" variant="body1" sx={{ mb: 0.75, opacity: 0.9 }} {...props} />
  ),
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Typography variant="caption" color="text.secondary">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        • {post.author}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 800, my: 2, fontSize: { xs: 28, md: 38 } }}>
        {post.title}
      </Typography>
      <Stack direction="row" sx={{ gap: 1, mb: 4, flexWrap: "wrap" }}>
        {post.tags?.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Stack>
      <Box component="article">
        <MDXRemote source={post.content} components={mdxComponents} />
      </Box>
    </Container>
  );
}
