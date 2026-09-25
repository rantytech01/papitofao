import { VolunteerForm } from "@/components/volunteer-form";

export const metadata = { title: "Get Involved" };

export default function VolunteerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="mb-4 font-display text-4xl font-extrabold text-campaign-navy">Get Involved</h1>
      <p className="mb-10 text-campaign-navy/70">
        Join the movement. Tell us how you&apos;d like to help and we&apos;ll be in touch.
      </p>
      <VolunteerForm />
    </div>
  );
}
