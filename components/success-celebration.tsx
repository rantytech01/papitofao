"use client";

import { useEffect, useMemo, useState } from "react";

const CONFETTI_COLORS = ["#ED1111", "#0757D5", "#071B3A", "#FFC107", "#22C55E", "#F97316"];
type ConfettiShape = "rect" | "circle" | "star";

/**
 * A small celebratory moment: starburst glow + a waving cartoon mascot +
 * fluttering confetti. Used after a poll vote, a "Become a Member"
 * signup, or a volunteer submission — anywhere we want a moment of
 * delight rather than just a plain success message. Self-contained
 * (pure SVG/CSS, no new dependencies, no image assets).
 */
export function SuccessCelebration({
  message,
  subMessage,
  onDone,
  autoDismissMs = 3200,
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
      Array.from({ length: 30 }).map((_, i) => {
        const shape: ConfettiShape = i % 3 === 0 ? "star" : i % 3 === 1 ? "circle" : "rect";
        return {
          left: Math.random() * 100,
          startTop: -70 - Math.random() * 70,
          delay: Math.random() * 0.35,
          duration: 2.1 + Math.random() * 1.4,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          rotate: 180 + Math.random() * 360,
          drift: (Math.random() - 0.5) * 90,
          wobble: 10 + Math.random() * 16,
          size: 6 + Math.random() * 6,
          shape,
        };
      }),
    []
  );

  const sparkles = useMemo(
    () =>
      [
        { x: 16, y: 26, size: 9, delay: 0.2, duration: 1.8 },
        { x: 132, y: 20, size: 7, delay: 0.9, duration: 2.2 },
        { x: 10, y: 108, size: 6, delay: 1.4, duration: 1.6 },
        { x: 138, y: 100, size: 8, delay: 0.5, duration: 2.0 },
        { x: 75, y: 4, size: 6, delay: 1.1, duration: 1.9 },
      ],
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
    <div className="celebration-card relative flex flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-12 text-center">
      <div className="pointer-events-none absolute inset-0">
        {confetti.map((c, i) => (
          <span
            key={i}
            className={`confetti-piece confetti-${c.shape}`}
            style={
              {
                left: `${c.left}%`,
                top: `${c.startTop}px`,
                width: c.shape === "rect" ? `${c.size * 0.6}px` : `${c.size}px`,
                height: c.shape === "rect" ? `${c.size * 1.8}px` : `${c.size}px`,
                backgroundColor: c.shape === "star" ? "transparent" : c.color,
                color: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                "--rotate": `${c.rotate}deg`,
                "--drift": `${c.drift}px`,
                "--wobble": `${c.wobble}px`,
              } as React.CSSProperties
            }
          >
            {c.shape === "star" && (
              <svg viewBox="0 0 24 24" width="100%" height="100%" fill={c.color}>
                <path d="M12 0l2.9 8.3H24l-7 5.6 2.7 8.6L12 17.6 4.3 22.5 7 13.9 0 8.3h9.1z" />
              </svg>
            )}
          </span>
        ))}
      </div>

      <div className="relative z-10">
        <svg width="150" height="150" viewBox="0 0 150 150" className="mascot mx-auto">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E7BF0" />
              <stop offset="100%" stopColor="#0757D5" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE3B8" />
              <stop offset="100%" stopColor="#FFD196" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4444" />
              <stop offset="100%" stopColor="#C90D0D" />
            </linearGradient>
            <radialGradient id="glowGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* soft glow halo */}
          <circle cx="75" cy="70" r="68" fill="url(#glowGrad)" />

          {/* rotating starburst rays */}
          <g className="starburst" style={{ transformOrigin: "75px 70px" }} opacity="0.25">
            <polygon
              fill="#FFC107"
              points="75,4 82,55 132,45 88,75 118,118 75,92 32,118 62,75 18,45 68,55"
            />
          </g>

          {/* drop shadow */}
          <ellipse cx="75" cy="140" rx="30" ry="6" fill="#071B3A" opacity="0.12" />

          {/* raised arms (cheer pose) */}
          <line x1="46" y1="88" x2="22" y2="46" stroke="url(#bodyGrad)" strokeWidth="13" strokeLinecap="round" />
          <line x1="104" y1="88" x2="128" y2="46" stroke="url(#bodyGrad)" strokeWidth="13" strokeLinecap="round" />
          <circle cx="20" cy="42" r="8" fill="url(#skinGrad)" />
          <circle cx="130" cy="42" r="8" fill="url(#skinGrad)" />

          {/* body */}
          <ellipse cx="75" cy="100" rx="34" ry="38" fill="url(#bodyGrad)" />

          {/* head */}
          <circle cx="75" cy="52" r="27" fill="url(#skinGrad)" />

          {/* blush */}
          <ellipse cx="59" cy="58" rx="5.5" ry="3.5" fill="#FF8A8A" opacity="0.55" />
          <ellipse cx="91" cy="58" rx="5.5" ry="3.5" fill="#FF8A8A" opacity="0.55" />

          {/* eyes with highlight */}
          <circle cx="65" cy="49" r="3.4" fill="#071B3A" />
          <circle cx="66.3" cy="47.7" r="1.1" fill="#fff" />
          <circle cx="85" cy="49" r="3.4" fill="#071B3A" />
          <circle cx="86.3" cy="47.7" r="1.1" fill="#fff" />

          {/* smile */}
          <path d="M62 58 Q75 70 88 58" stroke="#071B3A" strokeWidth="3.2" fill="none" strokeLinecap="round" />

          {/* party hat with pattern + pom-pom */}
          <polygon points="75,2 56,32 94,32" fill="url(#hatGrad)" />
          <circle cx="66" cy="24" r="2" fill="#fff" opacity="0.85" />
          <circle cx="75" cy="16" r="2" fill="#fff" opacity="0.85" />
          <circle cx="84" cy="24" r="2" fill="#fff" opacity="0.85" />
          <circle cx="75" cy="2" r="5.5" fill="#FFC107" />

          {/* streamers off the hat */}
          <path d="M80 5 Q95 10 92 22" stroke="#FFC107" strokeWidth="2" fill="none" strokeLinecap="round" className="streamer" />
          <path d="M70 5 Q55 10 58 22" stroke="#0757D5" strokeWidth="2" fill="none" strokeLinecap="round" className="streamer" />
        </svg>

        {sparkles.map((s, i) => (
          <svg
            key={i}
            className="sparkle"
            viewBox="0 0 24 24"
            width={s.size}
            height={s.size}
            style={{
              position: "absolute",
              left: `calc(50% - 75px + ${s.x}px)`,
              top: `${s.y}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
            fill="#FFC107"
          >
            <path d="M12 0l1.8 7.2L21 9l-7.2 1.8L12 18l-1.8-7.2L3 9l7.2-1.8z" />
          </svg>
        ))}

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-campaign-red">Success</p>
        <p className="mt-1 text-xl font-extrabold text-campaign-navy">{message}</p>
        {subMessage && <p className="mx-auto mt-2 max-w-xs text-sm text-campaign-navy/60">{subMessage}</p>}
      </div>

      <style jsx>{`
        .celebration-card {
          background: radial-gradient(circle at 50% 20%, rgba(7, 87, 213, 0.06), transparent 65%), #ffffff;
          box-shadow: 0 8px 30px rgba(7, 27, 58, 0.08);
        }

        .confetti-piece {
          position: absolute;
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.4, 0.1, 0.6, 0.9);
          animation-iteration-count: 1;
        }
        .confetti-rect {
          border-radius: 2px;
        }
        .confetti-circle {
          border-radius: 50%;
        }
        .confetti-star {
          display: block;
        }
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--drift) * 0.5 + var(--wobble)), 140px) rotate(calc(var(--rotate) * 0.5));
          }
          100% {
            transform: translate(var(--drift), 280px) rotate(var(--rotate));
            opacity: 0;
          }
        }

        .mascot {
          animation: mascot-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes mascot-pop {
          0% {
            transform: scale(0.3) translateY(24px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .starburst {
          animation: starburst-spin 14s linear infinite;
        }
        @keyframes starburst-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .streamer {
          transform-origin: 75px 5px;
          animation: streamer-sway 1.8s ease-in-out infinite;
        }
        @keyframes streamer-sway {
          0%,
          100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }

        .sparkle {
          animation-name: sparkle-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes sparkle-twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.6);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
