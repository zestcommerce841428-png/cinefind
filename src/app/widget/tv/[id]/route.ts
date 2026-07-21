import { getTvDetails } from "@/lib/tmdb";
import { tmdbImage } from "@/lib/tmdb/config";
import { TmdbError } from "@/lib/tmdb/fetcher";
import { renderWidgetHtml } from "@/lib/widget";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tv = await getTvDetails(id);
    const html = renderWidgetHtml({
      title: tv.name,
      subtitle: tv.first_air_date?.slice(0, 4) ?? "",
      voteAverage: tv.vote_average,
      voteCount: tv.vote_count,
      poster: tmdbImage(tv.poster_path, "w185"),
      href: `${new URL(request.url).origin}/tv/${id}`,
    });
    return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (err) {
    if (err instanceof TmdbError && err.status === 404) {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}
