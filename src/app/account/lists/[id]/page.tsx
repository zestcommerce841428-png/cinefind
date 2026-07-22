import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { getListDetails } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import MediaGrid from "@/components/media/MediaGrid";
import DeleteListButton from "./DeleteListButton";
import SignInRequired from "@/components/account/SignInRequired";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const list = await getListDetails(id);
    return { title: list.name, robots: { index: false, follow: false } };
  } catch {
    return { title: "List Not Found" };
  }
}

export default async function AccountListDetailPage({ params }: PageProps) {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="this list" />;

  const { id } = await params;
  let list;
  try {
    list = await getListDetails(id);
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) notFound();
    throw err;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {list.name}
        </Typography>
        <DeleteListButton listId={list.id} />
      </Stack>
      {list.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {list.description}
        </Typography>
      )}

      {list.items.length === 0 ? (
        <Typography color="text.secondary">
          This list is empty. Add movies or TV shows from their detail pages.
        </Typography>
      ) : (
        <MediaGrid items={list.items} />
      )}
    </Container>
  );
}
