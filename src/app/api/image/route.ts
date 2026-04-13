import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Only proxy images from trusted museum domains
  const allowed = [
    "www.artic.edu",
    "images.metmuseum.org",
    "collectionapi.metmuseum.org",
  ];
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!allowed.some((domain) => parsedUrl.hostname === domain)) {
    return new Response("Domain not allowed", { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://www.artic.edu/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return new Response(`Upstream error: ${res.status}`, {
        status: res.status,
      });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy error";
    return new Response(message, { status: 502 });
  }
}
