import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCountries } from "@/lib/tmdb";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Supported Countries & Regions",
  description: "All countries and regions supported by the TMDB catalog.",
  alternates: { canonical: "/reference/countries" },
};

export default async function CountriesPage() {
  const countries = await getCountries();
  const sorted = [...countries].sort((a, b) => a.english_name.localeCompare(b.english_name));

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Countries & Regions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {sorted.length} countries and regions used for release dates, certifications, and watch
        provider availability.
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>English Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Native Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((c) => (
            <TableRow key={c.iso_3166_1}>
              <TableCell>{c.iso_3166_1}</TableCell>
              <TableCell>{c.english_name}</TableCell>
              <TableCell>{c.native_name || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
