import type { Metadata } from "next";
import Link from "@/components/common/NextLink";
import SignInRequired from "@/components/account/SignInRequired";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { getAccountDetails, getAccountLists } from "@/lib/tmdb";
import { getSessionId } from "@/lib/session";
import CreateListForm from "./CreateListForm";

export const metadata: Metadata = {
  title: "My Lists",
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function AccountListsPage() {
  const sessionId = await getSessionId();
  if (!sessionId) return <SignInRequired what="your lists" />;

  const account = await getAccountDetails(sessionId);
  const lists = await getAccountLists(account.id, sessionId);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        My Lists
      </Typography>

      <CreateListForm />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {lists.results.map((list) => (
          <Grid key={list.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              component={Link}
              href={`/account/lists/${list.id}`}
              elevation={0}
              sx={{
                display: "block",
                p: 2.5,
                textDecoration: "none",
                color: "inherit",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {list.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {list.item_count} item{list.item_count === 1 ? "" : "s"}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
