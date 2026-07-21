function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface WidgetData {
  title: string;
  subtitle: string;
  voteAverage: number;
  voteCount: number;
  poster: string | null;
  href: string;
}

function ratingColor(pct: number) {
  if (pct >= 70) return "#21d07a";
  if (pct >= 40) return "#d2d531";
  return "#db2360";
}

export function renderWidgetHtml(data: WidgetData): string {
  const pct = Math.round((data.voteAverage ?? 0) * 10);
  const title = escapeHtml(data.title);
  const subtitle = escapeHtml(data.subtitle);
  const color = ratingColor(pct);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
  a.card { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #12161f; color: #fff; text-decoration: none; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); max-width: 360px; }
  a.card:hover { border-color: #0d6efd; }
  .poster { width: 46px; height: 69px; border-radius: 6px; object-fit: cover; background: #1b1f29; flex-shrink: 0; }
  .info { min-width: 0; }
  .title { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .subtitle { font-size: 12px; opacity: 0.7; margin-top: 2px; }
  .rating { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
  .badge { width: 28px; height: 28px; border-radius: 50%; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
  .powered { font-size: 10px; opacity: 0.5; margin-top: 6px; }
</style>
</head>
<body>
  <a class="card" href="${data.href}" target="_top" rel="noopener noreferrer">
    ${data.poster ? `<img class="poster" src="${data.poster}" alt="${title}" />` : `<div class="poster"></div>`}
    <div class="info">
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
      <div class="rating">
        <div class="badge">${pct > 0 ? pct + "%" : "NR"}</div>
        <span class="subtitle">${data.voteCount.toLocaleString()} votes</span>
      </div>
      <div class="powered">via CineFind / TMDB</div>
    </div>
  </a>
</body>
</html>`;
}
