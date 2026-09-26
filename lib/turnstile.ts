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
/**
 * Verifies a Cloudflare Turnstile token server-side, following Cloudflare's
 * canonical siteverify pattern: checks token shape, success, the expected
 * action (so a token solved for a different form can't be replayed here),
 * and the expected hostname. If TURNSTILE_SECRET_KEY isn't set in the
 * environment, verification is skipped and this returns true — so the site
 * keeps working before you've set up Turnstile, and starts enforcing
 * automatically the moment you add the env var. No code change needed to
 * turn it on later.
 *
 * To enable:
 * 1. Create (or reuse) a Turnstile widget at
 *    https://dash.cloudflare.com/?to=/:account/turnstile
 * 2. Add these env vars in Vercel (Project Settings → Environment Variables):
 *      NEXT_PUBLIC_TURNSTILE_SITE_KEY   (safe to expose to the browser)
 *      TURNSTILE_SECRET_KEY             (server-only, keep private)
 *      TURNSTILE_HOSTNAMES              (optional, comma-separated, e.g.
 *                                         "papitofao.vercel.app,newtonpapito.co.ke")
 */
export async function verifyTurnstile(
  token: FormDataEntryValue | null,
  ip: string,
  options: { expectedAction?: string } = {}
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet — don't block submissions

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();

    if (!data.success) return false;

    // A token solved for one action shouldn't be replayable for another.
    if (options.expectedAction && data.action !== options.expectedAction) {
      return false;
    }

    // If TURNSTILE_HOSTNAMES is set, reject tokens solved on an unexpected host.
    const expectedHostnames = (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    if (expectedHostnames.length > 0 && !expectedHostnames.includes(data.hostname)) {
      return false;
    }

    return true;
  } catch {
    // If Cloudflare's endpoint is unreachable, fail open rather than
    // blocking every legitimate submission on the site.
    return true;
  }
}
