# Your own artwork images

Drop image files here to show artists whose work is under copyright and
therefore unavailable from the free museum/Commons APIs (Picasso's paintings,
Pollock, Rothko, Warhol, O'Keeffe, etc.).

1. Put the file under `public/artists/<artist-id>/`, e.g.
   `public/artists/pollock/lavender-mist.jpg`
   (`<artist-id>` is the artist's `id` in `src/lib/artists.ts`.)
2. Register it in `src/lib/local-artworks.ts`.
3. Redeploy.

Recommended size ~800–1200px on the long edge. JPG or PNG.
