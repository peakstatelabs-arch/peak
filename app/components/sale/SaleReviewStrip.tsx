// Three short client check-ins (same excerpts as the homepage reviews).
const REVIEWS = [
  {
    quote: "So far I am down 19 lbs and about 5.5% bf. The results are blowing my mind!",
    stat: "-19 lb · -5.5% BF",
    name: "Paige P.",
  },
  {
    quote: "ZERO post-meal cravings for something sweet. The food noise was absent for much of the week.",
    stat: "Food noise gone",
    name: "Alana F.",
  },
  {
    quote: "I'm down 20.8 lbs and 4.8% body fat… and I'm not slowing down! I feel so good.",
    stat: "-20.8 lb · -4.8% BF",
    name: "Verified client",
  },
];

export function SaleReviewStrip() {
  return (
    <div className="mt-10">
      <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-white/60">
        <span className="text-[var(--accent)]">★★★★★</span> 70+ verified check-ins
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <blockquote className="text-sm leading-relaxed text-white/85">&ldquo;{r.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white">{r.name}</span>
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--accent)]">
                {r.stat}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-3 text-center">
        <a href="/reviews" className="text-sm font-semibold text-white/60 underline underline-offset-4 hover:text-white">
          Read all client reviews →
        </a>
      </p>
    </div>
  );
}
