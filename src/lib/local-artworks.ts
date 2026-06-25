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
  // ── The 9 artists with NO free image from any source (all in-copyright) ──
  // A folder is pre-made for each under public/artists/<id>/. Drop an image in,
  // then uncomment its line (titles/filenames below are suggestions — change
  // them to whatever work you actually add).
  //
  // Abstract Expressionism
  // { artistId: "pollock",       title: "Number 1, 1950 (Lavender Mist)", date: "1950",    file: "/artists/pollock/lavender-mist.jpg" },
  // { artistId: "rothko",        title: "Orange, Red, Yellow",            date: "1961",    file: "/artists/rothko/orange-red-yellow.jpg" },
  // { artistId: "de-kooning",    title: "Woman I",                        date: "1950–52", file: "/artists/de-kooning/woman-i.jpg" },
  // { artistId: "frankenthaler", title: "Mountains and Sea",              date: "1952",    file: "/artists/frankenthaler/mountains-and-sea.jpg" },
  //
  // Pop Art
  // { artistId: "oldenburg",     title: "Floor Burger",                   date: "1962",    file: "/artists/oldenburg/floor-burger.jpg" },
  // { artistId: "rosenquist",    title: "F-111",                          date: "1964–65", file: "/artists/rosenquist/f-111.jpg" },
  // { artistId: "ruscha",        title: "Standard Station",               date: "1966",    file: "/artists/ruscha/standard-station.jpg" },
  //
  // Surrealism
  // { artistId: "kahlo",         title: "The Two Fridas",                 date: "1939",    file: "/artists/kahlo/the-two-fridas.jpg" },
  // { artistId: "max-ernst",     title: "The Elephant Celebes",           date: "1921",    file: "/artists/max-ernst/elephant-celebes.jpg" },

  // ── You can also add extra images for any other artist the same way ──
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
