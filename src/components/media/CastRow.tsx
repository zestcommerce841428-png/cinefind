import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@/components/common/NextLink";
import { tmdbImage } from "@/lib/tmdb/config";
import type { CastMember } from "@/lib/tmdb/types";

export default function CastRow({ cast, seeAllHref }: { cast: CastMember[]; seeAllHref?: string }) {
  if (!cast?.length) return null;
  const top = cast.slice(0, 16);

  return (
    <Box component="section" sx={{ mb: 5 }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Top Cast
        </Typography>
        {seeAllHref && (
          <Button component={Link} href={seeAllHref} size="small">
            Full Cast & Crew
          </Button>
        )}
      </Stack>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
        {top.map((member) => (
          <Box
            key={member.id}
            component={Link}
            href={`/person/${member.id}`}
            sx={{
              flex: "0 0 auto",
              width: 110,
              textDecoration: "none",
              color: "inherit",
              textAlign: "center",
            }}
          >
            <Avatar
              src={tmdbImage(member.profile_path, "w185") ?? undefined}
              alt={member.name}
              sx={{ width: 88, height: 88, mx: "auto", mb: 1 }}
            >
              {member.name.charAt(0)}
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }} noWrap>
              {member.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {member.character}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
