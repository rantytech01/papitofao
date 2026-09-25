export function SectionHeading({
  title,
  subtitle,
  description,
  align = "left",
}: {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  align?: "left" | "center";
}) {
  if (!title) return null;
  return (
    <div className={`mb-8 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {subtitle && (
        <p className="mb-1 text-sm font-semibold text-campaign-red">{subtitle}</p>
      )}
      <h2 className="text-3xl font-bold text-campaign-navy md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-campaign-navy/70">{description}</p>
      )}
      <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-campaign-blue to-campaign-red" />
    </div>
  );
}
