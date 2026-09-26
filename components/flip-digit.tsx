"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One character of a flip clock. Animates a genuine 3D flip (old face
 * rotates away, new face — pre-rotated and backface-hidden — rotates
 * into view) rather than just swapping text, so the countdown visibly
 * "ticks" instead of jumping.
 */
export function FlipDigit({ char }: { char: string }) {
  const [displayed, setDisplayed] = useState(char);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(char);

  useEffect(() => {
    if (char !== prev.current) {
      setDisplayed(prev.current); // freeze the old value on the front face
      setFlipping(true);
      prev.current = char;
    }
  }, [char]);

  return (
    <div className="flip-digit">
      <div
        className={`flip-digit-card ${flipping ? "flip-digit-animate" : ""}`}
        onAnimationEnd={() => {
          setDisplayed(char);
          setFlipping(false);
        }}
      >
        <div className="flip-digit-face flip-digit-front">{displayed}</div>
        <div className="flip-digit-face flip-digit-back">{char}</div>
      </div>
      {/* static crease line for the classic split-flap look */}
      <div className="flip-digit-crease" />

      <style jsx>{`
        .flip-digit {
          position: relative;
          width: 1.1em;
          height: 1.4em;
          perspective: 240px;
        }
        .flip-digit-card {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }
        .flip-digit-animate {
          animation: flipDown 0.55s cubic-bezier(0.45, 0, 0.55, 1) forwards;
        }
        .flip-digit-face {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
        .flip-digit-back {
          transform: rotateX(180deg);
        }
        .flip-digit-crease {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(0, 0, 0, 0.25);
          pointer-events: none;
        }
        @keyframes flipDown {
          from {
            transform: rotateX(0deg);
          }
          to {
            transform: rotateX(-180deg);
          }
        }
      `}</style>
    </div>
  );
}
