import { Phone, MessageCircle, Mail } from "lucide-react";
import type { CampaignSettings } from "@/lib/types";

function digitsOnly(value: string) {
  return value.replace(/[^\d+]/g, "");
}

/**
 * Renders Call / WhatsApp / Email actions from `campaign_settings`.
 * Section 46 of the brief: this component is the ONLY place phone/
 * WhatsApp/email links are constructed — never hardcode tel:/mailto:
 * elsewhere in the app.
 */
export function ContactButtons({
  settings,
  className = "",
  variant = "default",
}: {
  settings: Pick<CampaignSettings, "primary_phone" | "whatsapp_number" | "email"> | null;
  className?: string;
  variant?: "default" | "compact";
}) {
  if (!settings) return null;

  const base =
    variant === "compact"
      ? "inline-flex items-center gap-1.5 text-sm font-medium"
      : "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {settings.primary_phone && (
        <a
          href={`tel:${digitsOnly(settings.primary_phone)}`}
          className={`${base} ${
            variant === "default" ? "bg-campaign-blue text-white hover:bg-campaign-blue-dark" : "text-campaign-blue"
          }`}
        >
          <Phone size={16} /> Call
        </a>
      )}
      {settings.whatsapp_number && (
        <a
          href={`https://wa.me/${digitsOnly(settings.whatsapp_number).replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${
            variant === "default" ? "bg-[#25D366] text-white hover:opacity-90" : "text-[#128C4A]"
          }`}
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      )}
      {settings.email && (
        <a
          href={`mailto:${settings.email}`}
          className={`${base} ${
            variant === "default" ? "bg-campaign-navy text-white hover:opacity-90" : "text-campaign-navy"
          }`}
        >
          <Mail size={16} /> Email
        </a>
      )}
    </div>
  );
}
