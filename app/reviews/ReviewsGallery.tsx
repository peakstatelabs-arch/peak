"use client";

import { useEffect, useState } from "react";
import {
  reviews,
  reviewCategories,
  type Review,
  type ReviewCategory,
} from "@/content/reviews";
import { cn } from "@/app/lib/cn";

type Filter = ReviewCategory | "all";

function SourceBadge({ source }: { source: Review["source"] }) {
  const isCommunity = source === "community";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]/70">
      {isCommunity ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {isCommunity ? "Community" : "Message"}
    </span>
  );
}

function StatChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-[var(--accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--accent-dark)]">
      {label}
    </span>
  );
}

function ReviewCard({
  review,
  onOpen,
}: {
  review: Review;
  onOpen: (src: string) => void;
}) {
  const hasPhotos = (review.photos?.length ?? 0) > 0;
  return (
    <figure
      className={cn(
        "break-inside-avoid mb-5 sm:mb-6 rounded-2xl border bg-white p-5 sm:p-6 card-hover",
        review.featured
          ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/50 shadow-[0_10px_40px_rgba(120,220,229,0.18)]"
          : "border-[var(--border)] shadow-[0_4px_20px_rgba(21,80,144,0.05)]",
      )}
    >
      {review.featured && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full gradient-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--primary)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21 8 14 2 9.4h7.6L12 2Z"
              fill="currentColor"
            />
          </svg>
          10-Week Journey
        </div>
      )}

      {hasPhotos && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {review.photos!.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onOpen(src)}
              className="group relative overflow-hidden rounded-xl border border-[var(--border)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${review.name} transformation photo ${i + 1}`}
                className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white"
          aria-hidden
        >
          {review.initial}
        </span>
        <div className="min-w-0">
          <figcaption className="text-sm font-bold text-[var(--primary)]">
            {review.name}
          </figcaption>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <SourceBadge source={review.source} />
            {review.timeframe && (
              <span className="text-[11px] font-medium text-[var(--primary)]/50">
                {review.timeframe}
              </span>
            )}
          </div>
        </div>
      </div>

      <blockquote
        className={cn(
          "mt-4 text-[var(--primary)]/85 leading-relaxed",
          review.featured ? "text-base" : "text-[15px]",
        )}
      >
        {review.quote}
      </blockquote>

      {review.stats && review.stats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {review.stats.map((s) => (
            <StatChip key={s} label={s} />
          ))}
        </div>
      )}

      {review.screenshot && (
        <button
          type="button"
          onClick={() => onOpen(review.screenshot!)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary-light)] transition-colors hover:text-[var(--primary)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          View original screenshot
        </button>
      )}
    </figure>
  );
}

function Lightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--primary)]/90 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Original screenshot"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M18 6 6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Original client screenshot"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-full rounded-xl object-contain shadow-2xl"
      />
    </div>
  );
}

export function ReviewsGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.categories.includes(filter));

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[{ key: "all", label: "All" } as const, ...reviewCategories].map(
          (c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key as Filter)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "bg-[var(--primary)] text-white shadow-[0_6px_20px_rgba(21,80,144,0.25)]"
                    : "border border-[var(--border)] bg-white text-[var(--primary)]/70 hover:border-[var(--accent)] hover:text-[var(--primary)]",
                )}
              >
                {c.label}
              </button>
            );
          },
        )}
      </div>

      {/* Masonry */}
      <div className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3">
        {visible.map((r) => (
          <ReviewCard key={r.id} review={r} onOpen={setLightbox} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-[var(--primary)]/60">
          No reviews in this category yet.
        </p>
      )}

      {lightbox && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
