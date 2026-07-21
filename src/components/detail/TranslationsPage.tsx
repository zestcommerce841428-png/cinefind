import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export interface TranslationRow {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
}

export default function TranslationsPage({
  title,
  backHref,
  translations,
}: {
  title: string;
  backHref: string;
  translations: TranslationRow[];
}) {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href={backHref}>{title}</Link>
        <Typography color="text.primary">Translations</Typography>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Translations ({translations.length})
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Language</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Region</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Native Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {translations.map((t, i) => (
            <TableRow key={`${t.iso_639_1}-${t.iso_3166_1}-${i}`}>
              <TableCell>{t.english_name}</TableCell>
              <TableCell>{t.iso_3166_1}</TableCell>
              <TableCell>{t.name || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
