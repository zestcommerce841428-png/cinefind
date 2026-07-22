import { NextResponse } from "next/server";
import { getPersonCombinedCredits, getMovieCredits, getTvCredits } from "@/lib/tmdb";
import type { CastMember } from "@/lib/tmdb/types";

const MAX_TITLES_PER_PERSON = 12;

interface TitleRef {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
}

async function topTitles(personId: string): Promise<TitleRef[]> {
  const credits = await getPersonCombinedCredits(personId);
  return [...credits.cast]
    .filter((c) => c.media_type === "movie" || c.media_type === "tv")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, MAX_TITLES_PER_PERSON)
    .map((c) => ({
      id: c.id,
      mediaType: c.media_type as "movie" | "tv",
      title: "title" in c ? (c as { title: string }).title : (c as { name: string }).name,
    }));
}

async function castOf(ref: TitleRef): Promise<CastMember[]> {
  const credits = ref.mediaType === "movie" ? await getMovieCredits(ref.id) : await getTvCredits(ref.id);
  return credits.cast;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const a = url.searchParams.get("a");
  const b = url.searchParams.get("b");
  if (!a || !b) {
    return NextResponse.json({ error: "Provide person ids as ?a= and ?b=" }, { status: 400 });
  }
  if (a === b) {
    return NextResponse.json({ degrees: 0, path: [] });
  }

  const [titlesA, titlesB] = await Promise.all([topTitles(a), topTitles(b)]);

  // Degree 1: shared title between the two people directly.
  const bIdSet = new Set(titlesB.map((t) => `${t.mediaType}-${t.id}`));
  const directShared = titlesA.find((t) => bIdSet.has(`${t.mediaType}-${t.id}`));
  if (directShared) {
    return NextResponse.json({
      degrees: 1,
      path: [{ via: directShared.title, mediaType: directShared.mediaType, mediaId: directShared.id }],
    });
  }

  // Degree 2: someone who appeared in one of A's titles also appeared in one of B's titles.
  const castA = await Promise.all(titlesA.map((t) => castOf(t).then((cast) => ({ ref: t, cast }))));
  const castB = await Promise.all(titlesB.map((t) => castOf(t).then((cast) => ({ ref: t, cast }))));

  const bPersonIndex = new Map<number, { name: string; ref: TitleRef }>();
  for (const { ref, cast } of castB) {
    for (const member of cast) {
      if (!bPersonIndex.has(member.id)) bPersonIndex.set(member.id, { name: member.name, ref });
    }
  }

  for (const { ref: refA, cast } of castA) {
    for (const member of cast) {
      if (String(member.id) === a) continue;
      const match = bPersonIndex.get(member.id);
      if (match) {
        return NextResponse.json({
          degrees: 2,
          path: [
            { via: refA.title, mediaType: refA.mediaType, mediaId: refA.id, connector: member.name, connectorId: member.id },
            { via: match.ref.title, mediaType: match.ref.mediaType, mediaId: match.ref.id },
          ],
        });
      }
    }
  }

  return NextResponse.json({
    degrees: null,
    message: `No connection found within their ${MAX_TITLES_PER_PERSON} most popular credits each.`,
  });
}
