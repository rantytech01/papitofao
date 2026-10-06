/**
 * wa.me requires the full international number with no leading zero or
 * plus sign. Admins often type the local Kenyan format (0725 656 735)
 * rather than international (+254 725 656 735), which would otherwise
 * produce a broken WhatsApp link — this normalizes either form.
 */
function toWhatsAppNumber(value: string) {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

/**
 * Fixed-position WhatsApp shortcut shown on every public page. Reads
 * from campaign_settings — falls back to the primary phone if no
 * dedicated WhatsApp number is set, and renders nothing at all if
 * neither exists (never shows a dead button).
 */
export function WhatsAppFloatButton({
  whatsappNumber,
  primaryPhone,
}: {
  whatsappNumber: string | null;
  primaryPhone: string | null;
}) {
  const number = whatsappNumber || primaryPhone;
  if (!number) return null;

  const message = "Hi, I'd like to know more about the campaign.";
  const href = `https://wa.me/${toWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white" className="relative" aria-hidden="true">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.258.59 4.455 1.712 6.39L3.2 28.8l6.59-1.728a12.74 12.74 0 0 0 6.213 1.583h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.656-12.804-12.656zm0 23.253h-.004a10.62 10.62 0 0 1-5.414-1.482l-.388-.23-4.016 1.053 1.072-3.916-.253-.402a10.6 10.6 0 0 1-1.625-5.677c0-5.868 4.775-10.643 10.633-10.643 2.84 0 5.51 1.108 7.516 3.118a10.56 10.56 0 0 1 3.113 7.526c0 5.868-4.775 10.653-10.634 10.653zm5.834-7.968c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.351-.498-2.573-1.588-.951-.849-1.593-1.898-1.78-2.218-.187-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55-.187-.01-.4-.01-.613-.01a1.18 1.18 0 0 0-.853.4c-.293.32-1.12 1.094-1.12 2.668s1.146 3.094 1.306 3.308c.16.213 2.256 3.445 5.467 4.83.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.89-.773 2.157-1.52.267-.746.267-1.386.187-1.52-.08-.133-.293-.213-.613-.373z" />
      </svg>
    </a>
  );
}
