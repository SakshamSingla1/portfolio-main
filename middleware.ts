// Vercel Edge Middleware (framework-agnostic — this is a Vite app, not Next.js).
//
// Fetches this domain's profile data server-to-server and embeds it directly
// in the served HTML, so the browser's initial page load never makes its own
// client-side request for it — there's nothing to see in the Network tab for
// that call, because it never happens client-side at all. src/components/pages/Index.tsx
// reads `window.__INITIAL_PROFILE_DATA__` and uses it directly when present,
// falling back to its normal client-side fetch if this ever fails or is
// skipped (local dev, a timeout, a non-200 from the backend, etc) — this is a
// pure enhancement layered on top of code that already works without it.
//
// Only the *initial* data load can work this way. Anything a visitor actively
// triggers afterward (submitting the contact form, a view-count ping) is
// still a genuine live browser request at that moment, and will always show
// up in Network tab no matter what — that's what the Network tab is for.

export const config = {
  // Skip static assets (anything with a file extension), the already-proxied
  // /api/* path (see vercel.json), and Vercel's own internal paths.
  matcher: ["/((?!api/|_vercel/|.*\\..*).*)"],
};

const BACKEND_PROFILE_MASTER_URL = "https://api.portfoliosbuilder.com/api/v1/public/profile-master";
const BACKEND_TIMEOUT_MS = 1500;

export default async function middleware(request: Request): Promise<Response> {
  const host = request.headers.get("host");

  // Run the two independent fetches in parallel: the untouched origin HTML
  // (so we're not adding this middleware's own latency on top of it) and the
  // backend profile call, so the client's first paint isn't delayed any
  // longer than a plain client-side fetch would have taken anyway.
  const originResponsePromise = fetch(request);

  const profileDataPromise = host
    ? fetchProfileData(host)
    : Promise.resolve(null);

  const [originResponse, profileData] = await Promise.all([
    originResponsePromise,
    profileDataPromise,
  ]);

  if (!profileData) return originResponse;

  const contentType = originResponse.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return originResponse;

  const html = await originResponse.text();
  const injected = html.replace(
    "</head>",
    `<script>window.__INITIAL_PROFILE_DATA__=${JSON.stringify(profileData)};</script></head>`
  );

  return new Response(injected, {
    status: originResponse.status,
    headers: originResponse.headers,
  });
}

async function fetchProfileData(host: string): Promise<unknown | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    // The backend resolves which profile to serve from the Referer header
    // (see PublicController.getProfileMasterByDomain) — same mechanism the
    // browser's own client-side fetch already relies on, just supplied here
    // by us instead of by the browser, since this call happens server-side.
    const res = await fetch(BACKEND_PROFILE_MASTER_URL, {
      headers: { Referer: `https://${host}/` },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
