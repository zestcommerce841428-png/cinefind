import { TMDB_BASE_URL, getReadAccessToken } from "./config";

export interface TmdbFetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  revalidate?: number | false;
  tags?: string[];
}

export class TmdbError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

// Thrown when the request never reaches TMDB at all (DNS, TLS, proxy/firewall,
// offline) — distinct from TmdbError, which means TMDB responded with an error.
export class TmdbNetworkError extends Error {
  constructor(cause: unknown) {
    super(
      "Could not reach api.themoviedb.org. This is a network-level failure (not an invalid API key) " +
        "— check your internet connection, and check whether a firewall, VPN, proxy, or antivirus is " +
        "blocking outbound HTTPS to api.themoviedb.org."
    );
    this.name = "TmdbNetworkError";
    this.cause = cause;
  }
}

export async function tmdbFetch<T>(path: string, options: TmdbFetchOptions = {}): Promise<T> {
  const { params = {}, revalidate = 3600, tags } = options;

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${getReadAccessToken()}`,
        Accept: "application/json",
      },
      next: revalidate === false ? { tags } : { revalidate, tags },
    });
  } catch (cause) {
    throw new TmdbNetworkError(cause);
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.status_message ?? message;
    } catch {
      // ignore
    }
    throw new TmdbError(message, res.status);
  }

  return res.json() as Promise<T>;
}
