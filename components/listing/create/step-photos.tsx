"use client";

import { useState, useRef } from "react";
import type { ListingDraft } from "./wizard";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepPhotos({ draft, updateDraft, onNext, onBack }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList) {
    if (!draft.id) return;
    setUploading(true);

    const newMedia = [...draft.media];

    for (let i = 0; i < files.length && newMedia.length < 9; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("listing_id", draft.id);
      formData.append("display_order", String(newMedia.length));

      try {
        const res = await fetch("/api/listings/media", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          newMedia.push({ id: data.id, url: data.url });
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    updateDraft({ media: newMedia });
    setUploading(false);
  }

  async function handleRemove(mediaId: string) {
    await fetch(`/api/listings/media?id=${mediaId}`, { method: "DELETE" });
    updateDraft({ media: draft.media.filter((m) => m.id !== mediaId) });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-normal tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Photos
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Add up to 9 photos. The first image becomes the hero on your listing.
        </p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-[var(--color-border)] p-12 text-center cursor-pointer hover:border-[var(--color-muted)] transition-colors"
      >
        <p className="text-base text-[var(--color-muted-foreground)]">
          {uploading ? "Uploading..." : "Click or drag photos here"}
        </p>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          {draft.media.length}/9 photos added
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {/* Photo grid */}
      {draft.media.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {draft.media.map((m, i) => (
            <div key={m.id} className="relative group aspect-[4/3]">
              <img
                src={m.url}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-[var(--color-foreground)] text-[var(--color-background)] text-xs px-2 py-1 font-medium">
                  Hero
                </span>
              )}
              <button
                onClick={() => handleRemove(m.id)}
                className="absolute top-2 right-2 bg-[var(--color-foreground)] text-[var(--color-background)] w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-full bg-[var(--color-foreground)] px-10 py-3 text-base font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-foreground)]/90"
        >
          Save &amp; continue
        </button>
      </div>
    </div>
  );
}
