import { PageHeader } from "@/components/PageHeader";
import { CheckInForm } from "./CheckInForm";

export const metadata = { title: "Weekly check-in — Peak State Labs" };

export default function CheckInPage() {
  return (
    <>
      <PageHeader title="Weekly check-in" description="Sixty seconds. Honest answers. Your charts depend on it." />
      <div className="max-w-xl">
        <CheckInForm />
      </div>
    </>
  );
}
