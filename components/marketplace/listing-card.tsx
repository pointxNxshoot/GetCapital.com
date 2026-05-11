"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatAskingPrice, formatCompactCurrency } from "@/lib/format-currency";
import { getIndustryLabel } from "@/app/data/industry-labels";

export type ListingCardData = {
  id: string;
  slug: string;
  business_name: string;
  industry_code: string;
  location_state: string;
  location_city: string;
  asking_price: number;
  public_description: string;
  years_in_operation: number;
  employees_count: number;
  is_demo: boolean;
  photos: {
    storage_path: string;
    alt_text: string;
    display_order: number;
    is_primary: boolean;
  }[];
  revenue_ltm: number;
  ebitda_ltm: number;
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const [hoveringPhoto, setHoveringPhoto] = useState(false);

  const photos = [...listing.photos].sort((a, b) => a.display_order - b.display_order);
  const photo = photos[currentPhoto];
  const industryLabel = getIndustryLabel(listing.industry_code);

  function prevPhoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((i) => (i > 0 ? i - 1 : photos.length - 1));
  }

  function nextPhoto(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((i) => (i < photos.length - 1 ? i + 1 : 0));
  }

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaved((s) => !s);
  }

  const facts = [
    { value: formatCompactCurrency(listing.revenue_ltm), label: "Revenue" },
    { value: formatCompactCurrency(listing.ebitda_ltm), label: "EBITDA" },
    { value: `${listing.years_in_operation} yrs`, label: "Years" },
    { value: listing.employees_count.toString(), label: "Employees" },
  ];

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block hover:bg-[var(--color-foreground)]/[0.015] transition-colors"
    >
      <div className="flex flex-col md:flex-row">
        {/* Photo area — 45% on desktop */}
        <div
          className="relative w-full md:w-[45%] aspect-[16/9] md:aspect-auto md:h-[340px] overflow-hidden flex-shrink-0"
          onMouseEnter={() => setHoveringPhoto(true)}
          onMouseLeave={() => setHoveringPhoto(false)}
        >
          {photo && (
            <Image
              src={photo.storage_path}
              alt={photo.alt_text || listing.business_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          )}

          {/* Demo badge */}
          {listing.is_demo && (
            <span className="absolute top-4 left-4 bg-[var(--color-background)]/90 text-[var(--color-muted-foreground)] text-xs font-medium uppercase tracking-wider px-3 py-1.5">
              Sample
            </span>
          )}

          {/* Save heart */}
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 flex items-center justify-center transition-colors hover:bg-white"
            aria-label={saved ? "Unsave listing" : "Save listing"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "var(--color-accent-orange)" : "none"} stroke={saved ? "var(--color-accent-orange)" : "var(--color-foreground)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Carousel arrows — hover only on desktop */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center transition-opacity ${
                  hoveringPhoto ? "opacity-100" : "opacity-0 md:opacity-0"
                } hover:bg-white`}
                aria-label="Previous photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextPhoto}
                className={`absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center transition-opacity ${
                  hoveringPhoto ? "opacity-100" : "opacity-0 md:opacity-0"
                } hover:bg-white`}
                aria-label="Next photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Photo counter */}
          {photos.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-[var(--color-foreground)]/70 text-white text-xs px-2.5 py-1 font-medium">
              {currentPhoto + 1} / {photos.length}
            </span>
          )}
        </div>

        {/* Information area — 55% on desktop */}
        <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Price */}
            <div
              className="text-4xl tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatAskingPrice(listing.asking_price)}
            </div>

            {/* Business name */}
            <h3
              className="text-2xl tracking-tight mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {listing.business_name}
            </h3>

            {/* Industry · Location */}
            <p className="text-base text-[var(--color-muted-foreground)] mt-2 truncate">
              {industryLabel} · {listing.location_city}, {listing.location_state}
            </p>
          </div>

          {/* Key facts row */}
          <div className="grid grid-cols-4 mt-6 md:mt-8">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`${i > 0 ? "border-l border-[var(--color-border)] pl-4 md:pl-6" : ""}`}
              >
                <div className="text-xl font-semibold leading-tight">
                  {fact.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-[var(--color-muted)] mt-1">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>

          {/* Description teaser */}
          <p className="text-base text-[var(--color-foreground)]/85 mt-5 md:mt-6 line-clamp-2">
            {listing.public_description}
          </p>
        </div>
      </div>
    </Link>
  );
}
