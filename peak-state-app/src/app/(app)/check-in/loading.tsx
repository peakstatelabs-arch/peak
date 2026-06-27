import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/Skeleton";

/**
 * Renders immediately on navigation to /check-in while the server
 * generates this week's AI questions (3-5s for the first visit per
 * week — cached after that). User sees the page shell + a skeleton
 * of the form, NOT a stalled blank tap.
 */
export default function CheckInLoading() {
  return (
    <>
      <PageHeader
        title="Weekly check-in"
        description="Quick honest answers. Tap a chip or type your own — your coach will see it."
      />
      <div className="max-w-xl space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-14 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </>
  );
}
