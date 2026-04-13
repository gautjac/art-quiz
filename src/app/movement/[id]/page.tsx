"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MOVEMENTS,
  getMovementById,
  getArtistsByMovement,
  type Artist,
} from "@/lib/artists";
import { searchArtworks, getImageUrl } from "@/lib/museums/aic";

interface GalleryImage {
  id: string;
  title: string;
  artistName: string;
  dateDisplay: string;
  imageUrl: string;
  blobUrl: string | null;
}

export default function MovementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [movementId, setMovementId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Unwrap params (Next.js 16 async params)
  useEffect(() => {
    params.then((p) => setMovementId(p.id));
  }, [params]);

  const movement = movementId ? getMovementById(movementId) : null;
  const artists = movementId ? getArtistsByMovement(movementId) : [];

  const loadGallery = useCallback(async () => {
    if (!artists.length) return;
    setLoading(true);

    const images: GalleryImage[] = [];

    // Fetch 1-2 artworks per artist in this movement, up to 6 total
    for (const artist of artists) {
      if (images.length >= 6) break;
      try {
        const { artworks, iiifUrl } = await searchArtworks(
          artist.searchTerms[0],
          5,
          artist.displayNames
        );
        const toTake = Math.min(
          artworks.length,
          artists.length <= 2 ? 3 : 2,
          6 - images.length
        );
        for (let i = 0; i < toTake; i++) {
          const a = artworks[i];
          images.push({
            id: `aic-${a.id}`,
            title: a.title,
            artistName: artist.name,
            dateDisplay: a.date_display,
            imageUrl: getImageUrl(iiifUrl, a.image_id!),
            blobUrl: null,
          });
        }
      } catch {
        // skip this artist
      }
    }

    // Pre-load images as blob URLs
    const preloaded = await Promise.all(
      images.map(async (img) => {
        try {
          const res = await fetch(img.imageUrl);
          if (!res.ok) return img;
          const blob = await res.blob();
          return { ...img, blobUrl: URL.createObjectURL(blob) };
        } catch {
          return img;
        }
      })
    );

    setGallery(preloaded);
    setLoading(false);
  }, [artists.map((a) => a.id).join(",")]);

  useEffect(() => {
    if (movementId && artists.length > 0) {
      loadGallery();
    }
  }, [movementId, loadGallery]);

  if (!movementId) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-16 h-20 shimmer rounded" />
      </div>
    );
  }

  if (!movement) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">Movement not found</h1>
          <Link
            href="/"
            className="text-gold-dark hover:underline"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="relative overflow-hidden bg-gallery-wall text-cream">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <Link
            href="/"
            className="text-cream/60 hover:text-cream text-sm transition-colors mb-4 inline-block"
          >
            &larr; Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.2em] font-medium">
              {movement.period}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-cream mb-3">
            {movement.name}
          </h1>
          <p className="text-cream/70 max-w-lg text-base leading-relaxed">
            {movement.description}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        {/* Long description */}
        <div className="museum-card p-5 sm:p-6">
          <p className="text-ink-light leading-relaxed text-[15px]">
            {movement.longDescription}
          </p>
        </div>

        {/* Artists in this movement */}
        <div>
          <h2 className="text-xl mb-4">
            {artists.length === 1 ? "Featured Artist" : "Key Artists"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {artists.map((artist) => (
              <div key={artist.id} className="museum-card p-4">
                <h3 className="font-medium mb-0.5">{artist.name}</h3>
                <p className="text-xs text-gold-dark mb-1.5">
                  {artist.nationality}, {artist.birthYear}–
                  {artist.deathYear || "present"}
                </p>
                <p className="text-sm text-ink-light leading-relaxed">
                  {artist.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Example paintings gallery */}
        <div>
          <h2 className="text-xl mb-4">Example Works</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="shimmer w-full aspect-[3/4] rounded mb-2" />
                  <div className="shimmer w-3/4 h-3 rounded mb-1" />
                  <div className="shimmer w-1/2 h-2.5 rounded" />
                </div>
              ))}
            </div>
          ) : gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="group">
                  <div className="overflow-hidden rounded painting-frame-sm mb-2">
                    <img
                      src={img.blobUrl || img.imageUrl}
                      alt={img.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm font-medium leading-tight truncate">
                    {img.title}
                  </p>
                  <p className="text-xs text-ink-muted truncate">
                    {img.artistName}, {img.dateDisplay}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              No example paintings available at the moment.
            </p>
          )}
        </div>

        {/* Back to Home button */}
        <div className="pt-4 pb-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-ink text-cream rounded-lg font-medium hover:bg-gallery-wall transition-colors cursor-pointer"
          >
            &larr; Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
