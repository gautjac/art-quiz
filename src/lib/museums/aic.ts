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

export async function searchArtworks(
  query: string,
  limit = 20
): Promise<{ artworks: AICSearchResult[]; iiifUrl: string }> {
  // Simple GET search — most reliable approach
  const url = `${AIC_BASE}/artworks/search?q=${encodeURIComponent(query)}&fields=${FIELDS}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`AIC API error: ${res.status}`);

  const data: AICApiResponse = await res.json();
  // Filter to artworks with images, and verify the artist name appears in the result
  const queryLower = query.toLowerCase();
  const artworks = data.data.filter(
    (a) =>
      a.image_id &&
      a.artist_display?.toLowerCase().includes(queryLower.split(" ").pop() || "")
  );
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
