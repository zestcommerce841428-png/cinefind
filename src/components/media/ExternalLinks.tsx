import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import LanguageIcon from "@mui/icons-material/Language";

interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
}

export default function ExternalLinks({
  homepage,
  externalIds,
}: {
  homepage?: string | null;
  externalIds: ExternalIds;
}) {
  const links: { label: string; href: string }[] = [];

  if (homepage) links.push({ label: "Official Site", href: homepage });
  if (externalIds.imdb_id) links.push({ label: "IMDb", href: `https://www.imdb.com/title/${externalIds.imdb_id}` });
  if (externalIds.facebook_id)
    links.push({ label: "Facebook", href: `https://facebook.com/${externalIds.facebook_id}` });
  if (externalIds.instagram_id)
    links.push({ label: "Instagram", href: `https://instagram.com/${externalIds.instagram_id}` });
  if (externalIds.twitter_id) links.push({ label: "X / Twitter", href: `https://x.com/${externalIds.twitter_id}` });

  if (links.length === 0) return null;

  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {links.map((link) => (
        <Chip
          key={link.label}
          component="a"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          clickable
          size="small"
          icon={<LanguageIcon fontSize="small" />}
          label={link.label}
        />
      ))}
    </Stack>
  );
}
