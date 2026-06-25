import { type Artist } from "./artists";
import { type ArtworkRecord } from "./storage";

// ─────────────────────────────────────────────────────────────────────────────
// Your own artwork images.
//
// The free museum/Commons APIs can't serve in-copyright modern art (Picasso's
// paintings, Pollock, Rothko, Warhol, O'Keeffe, etc.). To show those works,
// supply the images yourself here — they display in the quiz and movement
// galleries with TOP priority (ahead of, and without, any API lookup).
//
// HOW TO ADD ONE:
//   1. Put the image file under `public/artists/<artist-id>/`
//      e.g.  public/artists/pollock/lavender-mist.jpg
//      (<artist-id> is the artist's `id` in artists.ts — e.g. "pollock",
//       "warhol", "okeeffe", "picasso", "rothko".)
//   2. Add an entry below with that file's path (served from the site root,
//      so it begins with "/artists/...").
//   3. Redeploy. Done.
//
// Notes:
//   • A good size is ~800–1200px on the long edge (JPG or PNG).
//   • These are images YOU provide, so they skip all the name/quality
//     validation the API sources go through — they're trusted as-is.
//   • They're committed to the repo and served from the public site. If the
//     images are copyrighted, keep the repo private if that matters to you.
// ─────────────────────────────────────────────────────────────────────────────

export interface LocalArtwork {
  artistId: string; // must match an `id` in artists.ts
  title: string;
  date?: string; // shown under the work, e.g. "1950"
  file: string; // path under public/, e.g. "/artists/pollock/lavender-mist.jpg"
}

export const LOCAL_ARTWORKS: LocalArtwork[] = [
  // Examples — uncomment and point at real files you've added under public/artists/:
  //
  // { artistId: "pollock", title: "Number 1, 1950 (Lavender Mist)", date: "1950", file: "/artists/pollock/lavender-mist.jpg" },
  // { artistId: "rothko",  title: "Orange, Red, Yellow",            date: "1961", file: "/artists/rothko/orange-red-yellow.jpg" },
  // { artistId: "warhol",  title: "Marilyn Diptych",                date: "1962", file: "/artists/warhol/marilyn-diptych.jpg" },
  // { artistId: "okeeffe", title: "Jimson Weed/White Flower No. 1", date: "1932", file: "/artists/okeeffe/jimson-weed.jpg" },
  // { artistId: "picasso", title: "Les Demoiselles d'Avignon",      date: "1907", file: "/artists/picasso/demoiselles.jpg" },
];

/** Local images registered for an artist, as ready-to-display ArtworkRecords. */
export function getLocalArtworks(artist: Artist): ArtworkRecord[] {
  return LOCAL_ARTWORKS.filter((a) => a.artistId === artist.id).map((a) => ({
    id: `local-${a.artistId}-${a.file.split("/").pop()}`,
    title: a.title,
    artistId: artist.id,
    artistName: artist.name,
    imageUrl: a.file,
    dateDisplay: a.date ?? "",
    museum: "local" as const,
    museumId: a.file,
  }));
}
