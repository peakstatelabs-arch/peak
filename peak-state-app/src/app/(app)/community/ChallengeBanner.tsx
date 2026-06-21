import type { Challenge } from "@/lib/community";

export function ChallengeBanner({
  challenge,
  hits,
  total,
  weekKey,
}: {
  challenge: Challenge;
  hits: number;
  total: number;
  weekKey: string;
}) {
  const pct = total > 0 ? Math.round((hits / total) * 100) : 0;
  const daysLeft = daysUntilSunday();

  return (
    <section className="card bg-gradient-to-br from-accent/15 via-bg-card to-bg-card border-accent/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-accent font-semibold">
            This week · {weekKey}
          </div>
          <h3 className="font-display font-semibold text-lg mt-0.5">{challenge.title}</h3>
          <p className="text-sm text-fg-muted mt-1">{challenge.blurb}</p>
        </div>
        <span className="chip-accent text-xs flex-shrink-0">
          {daysLeft}d left
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-xs text-fg-muted mb-1.5">
          <span>
            <span className="font-semibold text-fg tabular-nums">{hits}</span> of {total}{" "}
            {total === 1 ? "member" : "members"} hit it
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function daysUntilSunday(): number {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
  // Days until next Sunday end-of-day (inclusive of today if today is Sun? treat Sun as 0 = "today, last day")
  return day === 0 ? 0 : 7 - day;
}
