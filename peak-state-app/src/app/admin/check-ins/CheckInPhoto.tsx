import { createAdminClient } from "@/lib/supabase/server";

export async function CheckInPhoto({ path }: { path: string }) {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("progress-photos")
    .createSignedUrl(path, 60 * 60); // 1h signed URL is plenty for a review session

  if (error || !data?.signedUrl) {
    return <p className="text-xs text-fg-subtle">Photo unavailable.</p>;
  }

  return (
    <a href={data.signedUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.signedUrl}
        alt="Progress photo"
        className="h-40 w-40 object-cover rounded-lg border border-border hover:opacity-90"
      />
    </a>
  );
}
