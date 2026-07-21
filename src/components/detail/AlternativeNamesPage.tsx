import Link from "@/components/common/NextLink";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

export default function AlternativeNamesPage({
  title,
  backHref,
  names,
}: {
  title: string;
  backHref: string;
  names: { name: string; type: string }[];
}) {
  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Alternative Names</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Alternative Names
      </Typography>
      {names.length === 0 ? (
        <Typography color="text.secondary">No alternative names on record.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {names.map((n, i) => (
            <Stack key={i} direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {n.name}
              </Typography>
              {n.type && <Chip label={n.type} size="small" variant="outlined" />}
            </Stack>
          ))}
        </Stack>
      )}
    </Container>
  );
}
