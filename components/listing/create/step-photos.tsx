"use client";

import { useState, useRef } from "react";
import type { ListingDraft } from "./wizard";
import { WizardStepHeading, WizardActions } from "./form-fields";

type Props = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function StepPhotos({ draft, updateDraft, onNext, onBack }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList) {
    if (!draft.id) {
      setUploadError("Please complete the Basics step first so we can save your listing.");
      return;
    }
    setUploading(true);
    setUploadError(null);

    const newMedia = [...draft.media];

    for (let i = 0; i < files.length && newMedia.length < 9; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setUploadError(`"${file.name}" is not an image file.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`"${file.name}" is too large. Maximum 10MB per image.`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("listing_id", draft.id);
      formData.append("display_order", String(newMedia.length));

      try {
        const res = await fetch("/api/listings/media", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          newMedia.push({ id: data.id, url: data.url });
        } else {
          setUploadError(data.error || "Upload failed. Please try again.");
        }
      } catch {
        setUploadError("Network error. Please check your connection and try again.");
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
    <div>
      <WizardStepHeading
        title="Photos"
        description="Add up to 9 photos. The first image becomes the hero on your listing."
      />

      {uploadError && (
        <p className="text-sm text-red-600 mb-6">{uploadError}</p>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-[var(--color-accent-orange)] bg-[var(--color-accent-orange)]/5"
            : "border-[var(--color-border)] hover:border-[var(--color-muted)]"
        }`}
      >
        <p className="text-base text-[var(--color-muted-foreground)]">
          {uploading ? "Uploading..." : "Click or drag photos here"}
        </p>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          JPG, PNG, or WebP. Max 10MB each. {draft.media.length}/9 added.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {draft.media.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {draft.media.map((m, i) => (
            <div key={m.id} className="relative group aspect-[4/3]">
              <img src={m.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-[var(--color-accent-orange)] text-white text-xs px-2 py-1 font-medium uppercase tracking-wider">
                  Primary
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(m.id); }}
                className="absolute top-2 right-2 bg-[var(--color-foreground)] text-[var(--color-background)] w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <WizardActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
