"use client";

import Script from "next/script";

/**
 * Renders the Turnstile widget inside a <form>. Cloudflare's script injects
 * a hidden input named "cf-turnstile-response" into this div automatically,
 * which gets submitted along with the rest of the form's fields as long as
 * this component sits inside the same <form>.
 *
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set — safe to
 * leave in place before you've set up Turnstile.
 */
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />
    </>
  );
}
