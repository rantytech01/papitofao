/**
 * Verifies a Cloudflare Turnstile token server-side. If TURNSTILE_SECRET_KEY
 * isn't set in the environment, verification is skipped and this returns
 * true — so the site keeps working before you've set up Turnstile, and
 * starts enforcing automatically the moment you add the env var. No code
 * change needed to turn it on later.
 *
 * To enable: create a free Turnstile widget at
 * https://dash.cloudflare.com/?to=/:account/turnstile
 * then add two env vars in Vercel (Project Settings → Environment Variables):
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   (safe to expose to the browser)
 *   TURNSTILE_SECRET_KEY             (server-only, keep private)
 */
export async function verifyTurnstile(token: FormDataEntryValue | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet — don't block submissions

  if (!token || typeof token !== "string") return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    // If Cloudflare's endpoint is unreachable, fail open rather than
    // blocking every legitimate submission on the site.
    return true;
  }
}
