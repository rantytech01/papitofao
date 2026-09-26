import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

const DEVICE_COOKIE = "device_id";
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Returns a stable anonymous device id stored in an httpOnly cookie,
 * creating one on first use. This is NOT personally identifying — it's
 * just a random token — but it lets us tell "the same browser tried
 * this 10 times in a minute" apart from "10 different people," which
 * IP alone can't do reliably (many Kenyan mobile users share carrier
 * IPs behind NAT, so IP-only limiting risks blocking innocent people
 * on the same network as a bot).
 *
 * Must be called from a Server Action or Route Handler (cookies().set
 * is not allowed in plain Server Components).
 */
export function getOrSetDeviceId(): string {
  const store = cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(DEVICE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: DEVICE_COOKIE_MAX_AGE,
    path: "/",
  });
  return id;
}

export function getRequestIp(): string {
  const h = headers();
  // Vercel sets x-forwarded-for; the first entry is the original client IP.
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Combined device + IP rate limit. Both must pass. Device limit is the
 * primary signal (tighter); IP limit is a looser backstop that still
 * catches a bot cycling through cleared cookies from the same machine,
 * without being so tight it blocks a shared network.
 */
export async function checkRateLimit(
  actionName: string,
  options?: { deviceMax?: number; ipMax?: number; windowMinutes?: number }
): Promise<{ allowed: boolean; reason?: string }> {
  const deviceMax = options?.deviceMax ?? 3;
  const ipMax = options?.ipMax ?? 15;
  const windowMinutes = options?.windowMinutes ?? 60;

  const supabase = createClient();
  const deviceId = getOrSetDeviceId();
  const ip = getRequestIp();

  const { data: deviceOk } = await supabase.rpc("check_and_log_submission", {
    p_action: `${actionName}:device`,
    p_fingerprint: deviceId,
    p_max: deviceMax,
    p_window_minutes: windowMinutes,
  });

  if (!deviceOk) {
    return { allowed: false, reason: "Too many submissions from this device. Please try again later." };
  }

  const { data: ipOk } = await supabase.rpc("check_and_log_submission", {
    p_action: `${actionName}:ip`,
    p_fingerprint: ip,
    p_max: ipMax,
    p_window_minutes: windowMinutes,
  });

  if (!ipOk) {
    return { allowed: false, reason: "Too many submissions from this network. Please try again later." };
  }

  return { allowed: true };
}

/**
 * Honeypot check: a hidden field real users never see or fill in.
 * A bot that blindly fills every field will populate it. We treat a
 * filled honeypot as a silent bot signal — callers should return a
 * fake success rather than an error, so the bot doesn't learn to
 * avoid this specific field.
 */
export function isHoneypotTripped(formData: FormData, fieldName = "website"): boolean {
  const value = formData.get(fieldName);
  return typeof value === "string" && value.trim().length > 0;
}
