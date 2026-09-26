"use client";

import { useEffect, useMemo, useState } from "react";

const COLORS = ["#ED1111", "#0757D5", "#071B3A", "#FFC107", "#22C55E"];

/**
 * A small celebratory moment: confetti + a waving cartoon mascot.
 * Used after a poll vote, a "Become a Member" signup, or a volunteer
 * submission — anywhere we want a moment of delight rather than just
 * a plain success message. Self-contained (no new dependencies).
 */
export function SuccessCelebration({
  message,
  subMessage,
  onDone,
  autoDismissMs = 2600,
}: {
  message: string;
  subMessage?: string;
  onDone?: () => void;
  /** Pass a very large number (or omit onDone) to keep it on screen. */
  autoDismissMs?: number;
}) {
  const [visible, setVisible] = useState(true);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.2,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    []
  );

  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(() => {
      setVisible(false);
      onDone();
    }, autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs, onDone]);

  if (!visible) return null;

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white px-6 py-10 text-center">
      <div className="pointer-events-none absolute inset-0">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              transform: `rotate(${c.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mascot mx-auto">
          <circle cx="60" cy="66" r="34" fill="#0757D5" />
          <circle cx="60" cy="34" r="24" fill="#FFD9A0" />
          <circle cx="52" cy="32" r="3" fill="#071B3A" />
          <circle cx="68" cy="32" r="3" fill="#071B3A" />
          <path d="M50 40 Q60 48 70 40" stroke="#071B3A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <g className="mascot-arm">
            <rect x="86" y="52" width="10" height="28" rx="5" fill="#0757D5" />
            <circle cx="91" cy="50" r="7" fill="#FFD9A0" />
          </g>
          <rect x="24" y="60" width="10" height="26" rx="5" fill="#0757D5" />
          <polygon points="60,0 48,22 72,22" fill="#ED1111" />
          <circle cx="60" cy="0" r="4" fill="#FFC107" />
        </svg>

        <p className="mt-4 text-lg font-extrabold text-campaign-navy">{message}</p>
        {subMessage && <p className="mt-1 text-sm text-campaign-navy/60">{subMessage}</p>}
      </div>

      <style jsx>{`
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 14px;
          border-radius: 2px;
          animation-name: confetti-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: 1;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(220px) rotate(360deg);
            opacity: 0;
          }
        }
        .mascot {
          animation: mascot-pop 0.6s ease-out;
        }
        @keyframes mascot-pop {
          0% {
            transform: scale(0.4) translateY(30px);
            opacity: 0;
          }
          60% {
            transform: scale(1.08) translateY(-6px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .mascot-arm {
          transform-origin: 92px 60px;
          animation: mascot-wave 0.6s ease-in-out infinite;
          animation-delay: 0.6s;
        }
        @keyframes mascot-wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-20deg);
          }
        }
      `}</style>
    </div>
  );
}
