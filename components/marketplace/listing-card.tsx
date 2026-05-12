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

  return (
    <Link href={`/listings/${listing.slug}`} className="block">
      <article
        className="group relative flex flex-col md:flex-row bg-white border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-200 ease-out cursor-pointer"
        style={{
          boxShadow: "var(--shadow-card-rest)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,10,10,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-rest)";
          (e.currentTarget as HTMLElement).style.borderColor = "";
        }}
      >
        {/* Photo area — 45% on desktop, 16:10 aspect */}
        <div className="relative w-full md:w-[45%] aspect-[16/10] overflow-hidden bg-[var(--color-muted)]/10">
          {photo && (
            <Image
              key={photo.storage_path}
              src={photo.storage_path}
              alt={photo.alt_text || listing.business_name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={priority && currentPhoto === 0}
              quality={85}
            />
          )}

          {/* Sample badge — warm cream bg with blur */}
          {listing.is_demo && (
            <span className="absolute top-3 left-3 z-10 bg-[var(--color-background)]/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-[var(--color-foreground)] rounded-md"
              style={{ boxShadow: "var(--shadow-card-rest)" }}
            >
              Sample
            </span>
          )}

          {/* Save heart — white circle with blur */}
          <button
            onClick={toggleSave}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all duration-150"
            style={{ boxShadow: "var(--shadow-card-rest)" }}
            aria-label={saved ? "Remove from saved" : "Save listing"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "var(--color-foreground)" : "none"}
              stroke="var(--color-foreground)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={saved ? "opacity-100" : "opacity-70"}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Carousel arrows — appear on card hover */}
          {photos.length > 1 && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center pointer-events-auto transition-colors"
                style={{ boxShadow: "var(--shadow-card-rest)" }}
                aria-label="Previous photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center pointer-events-auto transition-colors"
                style={{ boxShadow: "var(--shadow-card-rest)" }}
                aria-label="Next photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}

          {/* Photo counter — dark pill */}
          {photos.length > 1 && (
            <span className="absolute bottom-3 right-3 z-10 px-2 py-0.5 bg-[var(--color-foreground)]/70 backdrop-blur-sm text-white text-xs font-medium rounded-md">
              {currentPhoto + 1} / {photos.length}
            </span>
          )}
        </div>

        {/* Information area — tighter rhythm */}
        <div className="flex-1 p-6 md:p-8 flex flex-col">
          {/* Price */}
          <p
            className="text-3xl md:text-4xl font-medium tracking-tight text-[var(--color-foreground)] mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {formatAskingPrice(listing.asking_price)}
          </p>

          {/* Business name */}
          <h3
            className="text-xl md:text-2xl tracking-tight text-[var(--color-foreground)] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {listing.business_name}
          </h3>

          {/* Industry · Location */}
          <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
            {industryLabel} · {listing.location_city}, {listing.location_state}
          </p>

          {/* Metrics row — smaller, supporting */}
          <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-[var(--color-border)]/60">
            <Metric value={formatCompactCurrency(listing.revenue_ltm)} label="Revenue" />
            <Metric value={formatCompactCurrency(listing.ebitda_ltm)} label="EBITDA" />
            <Metric value={`${listing.years_in_operation} yrs`} label="Operating" />
            <Metric value={listing.employees_count.toString()} label="Employees" />
          </div>

          {/* Description teaser */}
          <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed">
            {listing.public_description}
          </p>
        </div>
      </article>
    </Link>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-base font-medium text-[var(--color-foreground)] leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </span>
      <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--color-muted)] leading-tight mt-1">
        {label}
      </span>
    </div>
  );
}
