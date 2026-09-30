"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const containerStyle: CSSProperties = {
  position: "relative",
  width: "1.1em",
  height: "1.4em",
  perspective: "240px",
};

const cardStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  transformStyle: "preserve-3d",
};

const faceBaseStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const backFaceStyle: CSSProperties = {
  ...faceBaseStyle,
  transform: "rotateX(180deg)",
};

const creaseStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  height: "1px",
  background: "rgba(0,0,0,0.25)",
  pointerEvents: "none",
};

/**
 * One character of a flip clock. All box/3D-transform CSS is inline
 * (not styled-jsx) so it can never silently fail to apply on build —
 * only the animation itself (defined once in globals.css as
 * .flip-digit-animate / @keyframes flip-digit-down) is a plain class.
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
    <div style={containerStyle}>
      <div
        style={cardStyle}
        className={flipping ? "flip-digit-animate" : undefined}
        onAnimationEnd={() => {
          setDisplayed(char);
          setFlipping(false);
        }}
      >
        <div style={faceBaseStyle}>{displayed}</div>
        <div style={backFaceStyle}>{char}</div>
      </div>
      <div style={creaseStyle} />
    </div>
  );
}
