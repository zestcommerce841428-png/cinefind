import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "@/components/common/NextLink";
import { getLanguages } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Supported Languages",
  description: "All languages supported by the TMDB catalog.",
  alternates: { canonical: "/reference/languages" },
};

export default async function LanguagesPage() {
  const languages = await getLanguages();
  const sorted = [...languages].sort((a, b) => a.english_name.localeCompare(b.english_name));

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Supported Languages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {sorted.length} languages available across the TMDB catalog.
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>English Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Native Name</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((lang) => (
            <TableRow key={lang.iso_639_1}>
              <TableCell>{lang.iso_639_1}</TableCell>
              <TableCell>{lang.english_name}</TableCell>
              <TableCell>{lang.name || "—"}</TableCell>
              <TableCell>
                <Link href={`/language/${lang.iso_639_1}`}>Browse movies</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
