// Art Institute of Chicago API
// Docs: https://api.artic.edu/docs/

export interface AICSearchResult {
  id: number;
  title: string;
  artist_display: string;
  date_display: string;
  image_id: string | null;
  thumbnail: { alt_text: string } | null;
  medium_display: string;
  dimensions: string;
  credit_line: string;
  classification_title: string;
}

export interface AICApiResponse {
  data: AICSearchResult[];
  config: { iiif_url: string };
}

const AIC_BASE = "https://api.artic.edu/api/v1";

const FIELDS = [
  "id",
  "title",
  "artist_display",
  "date_display",
  "image_id",
  "thumbnail",
  "medium_display",
  "dimensions",
  "credit_line",
  "classification_title",
].join(",");

// Prefixes that indicate a copy/follower/imitator — NOT the actual artist
const ATTRIBUTION_PREFIXES = [
  "after ",
  "attributed to ",
  "circle of ",
  "copy after ",
  "follower of ",
  "imitator of ",
  "manner of ",
  "possibly ",
  "school of ",
  "style of ",
  "workshop of ",
];

/**
 * Check if an artwork is genuinely BY the artist (not a copy/follower/etc).
 * `validNames` should be the exact display name variants that the artist_display
 * field should START with (case-insensitive).
 */
export function isGenuineAttribution(
  artistDisplay: string,
  validNames: string[]
): boolean {
  const display = artistDisplay.toLowerCase().trim();

  // Reject if it starts with a copy/attribution prefix
  for (const prefix of ATTRIBUTION_PREFIXES) {
    if (display.startsWith(prefix)) return false;
  }

  // The display must start with one of the valid name variants
  return validNames.some((name) => display.startsWith(name.toLowerCase()));
}

export async function searchArtworks(
  query: string,
  limit = 20,
  validNames?: string[]
): Promise<{ artworks: AICSearchResult[]; iiifUrl: string }> {
  // Simple GET search — most reliable approach
  const url = `${AIC_BASE}/artworks/search?q=${encodeURIComponent(query)}&fields=${FIELDS}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`AIC API error: ${res.status}`);

  const data: AICApiResponse = await res.json();

  const artworks = data.data.filter((a) => {
    if (!a.image_id || !a.artist_display) return false;

    // If we have valid name variants, use strict matching
    if (validNames && validNames.length > 0) {
      return isGenuineAttribution(a.artist_display, validNames);
    }

    // Fallback: check that the last name from the query appears and no copy prefix
    const display = a.artist_display.toLowerCase();
    const lastName = query.toLowerCase().split(" ").pop() || "";
    if (!display.includes(lastName)) return false;
    for (const prefix of ATTRIBUTION_PREFIXES) {
      if (display.startsWith(prefix)) return false;
    }
    return true;
  });

  return { artworks, iiifUrl: data.config.iiif_url };
}

export function getImageUrl(
  iiifUrl: string,
  imageId: string,
  width = 600
): string {
  // Proxy through our API to add the required Referer header
  const direct = `${iiifUrl}/${imageId}/full/${width},/0/default.jpg`;
  return `/api/image?url=${encodeURIComponent(direct)}`;
}

export async function getArtworkById(
  id: number
): Promise<{ artwork: AICSearchResult; iiifUrl: string } | null> {
  const url = `${AIC_BASE}/artworks/${id}?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return { artwork: data.data, iiifUrl: data.config.iiif_url };
}
