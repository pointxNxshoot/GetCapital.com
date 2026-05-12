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

const shadow = "drop-shadow(0 1px 3px rgba(0,0,0,0.5))";

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: ListingCardData;
  priority?: boolean;
}) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [saved, setSaved] = useState(false);

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
        {/* Photo area */}
        <div className="relative w-full md:w-[45%] aspect-[16/9] md:aspect-auto md:h-[340px] overflow-hidden flex-shrink-0">
          {photo && (
            <Image
              key={photo.storage_path}
              src={photo.storage_path}
              alt={photo.alt_text || listing.business_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={priority && currentPhoto === 0}
              quality={85}
            />
          )}

          {/* Sample badge */}
          {listing.is_demo && (
            <span className="absolute top-4 left-4 bg-white/85 backdrop-blur-sm px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-[var(--color-foreground)]/80">
              Sample
            </span>
          )}

          {/* Save heart — no container */}
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4 hover:scale-110 transition-transform"
            style={{ filter: shadow }}
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={saved ? "#FF6A00" : "none"}
              stroke={saved ? "#FF6A00" : "white"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Carousel arrows — no container, drop shadow */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                style={{ filter: shadow }}
                aria-label="Previous photo"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                style={{ filter: shadow }}
                aria-label="Next photo"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Photo counter — plain text */}
          {photos.length > 1 && (
            <span
              className="absolute bottom-4 right-4 text-white text-sm font-medium"
              style={{ filter: shadow }}
            >
              {currentPhoto + 1} / {photos.length}
            </span>
          )}
        </div>

        {/* Information area */}
        <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div
              className="text-4xl tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatAskingPrice(listing.asking_price)}
            </div>

            <h3
              className="text-2xl tracking-tight mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {listing.business_name}
            </h3>

            <p className="text-base text-[var(--color-muted-foreground)] mt-2 truncate">
              {industryLabel} · {listing.location_city}, {listing.location_state}
            </p>
          </div>

          <div className="grid grid-cols-4 mt-6 md:mt-8">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={i > 0 ? "border-l border-[var(--color-border)] pl-4 md:pl-6" : ""}
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

          <p className="text-base text-[var(--color-foreground)]/85 mt-5 md:mt-6 line-clamp-2">
            {listing.public_description}
          </p>
        </div>
      </div>
    </Link>
  );
}
