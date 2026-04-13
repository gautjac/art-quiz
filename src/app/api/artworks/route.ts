import { type NextRequest } from "next/server";
import * as aic from "@/lib/museums/aic";
import * as met from "@/lib/museums/met";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const source = searchParams.get("source") || "aic";

  if (!query) {
    return Response.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    if (source === "aic") {
      const { artworks, iiifUrl } = await aic.searchArtworks(query, 10);
      const results = artworks.map((a) => ({
        id: `aic-${a.id}`,
        title: a.title,
        artistDisplay: a.artist_display,
        dateDisplay: a.date_display,
        imageUrl: aic.getImageUrl(iiifUrl, a.image_id!, 843),
        museum: "aic",
        museumId: a.id,
      }));
      return Response.json({ artworks: results });
    } else {
      const ids = await met.searchArtworks(query, 10);
      const artworks = await met.getArtworksByIds(ids.slice(0, 5), 3);
      const results = artworks.map((a) => ({
        id: `met-${a.objectID}`,
        title: a.title,
        artistDisplay: a.artistDisplayName,
        dateDisplay: a.objectDate,
        imageUrl: a.primaryImage,
        museum: "met",
        museumId: a.objectID,
      }));
      return Response.json({ artworks: results });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
