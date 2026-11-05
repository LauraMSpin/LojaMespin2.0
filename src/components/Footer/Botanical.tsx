import type { CSSProperties } from "react";

const LEAVES: { x: number; y: number; r: number; s: number }[] = [
  { x: 58, y: 292, r: -62, s: 1.15 },
  { x: 66, y: 262, r: 28, s: 1.1 },
  { x: 76, y: 232, r: -58, s: 1.05 },
  { x: 90, y: 202, r: 24, s: 1.0 },
  { x: 108, y: 172, r: -52, s: 0.95 },
  { x: 130, y: 142, r: 20, s: 0.9 },
  { x: 154, y: 114, r: -48, s: 0.82 },
  { x: 176, y: 90, r: 14, s: 0.72 },
  { x: 192, y: 70, r: -40, s: 0.6 }
];

/** Ramo linear decorativo (SVG leve). `mirror` espelha para a extremidade direita. */
export default function Botanical({
  className,
  mirror = false,
  style
}: {
  className?: string;
  mirror?: boolean;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={{ ...style, transform: mirror ? "scaleX(-1)" : undefined }}
      viewBox="0 0 220 340"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M44 330 C 52 270, 70 210, 110 160 C 140 122, 176 92, 206 56" />
      {LEAVES.map((l) => (
        <g key={`${l.x}-${l.y}`} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d="M0 0 C 8 -17, 30 -19, 46 0 C 30 19, 8 17, 0 0 Z" />
          <path d="M0 0 L 40 0" />
          <path d="M10 0 L 20 -7 M10 0 L 20 7 M22 0 L 31 -6 M22 0 L 31 6" strokeWidth="0.7" />
        </g>
      ))}
      <circle cx="30" cy="318" r="2.2" />
      <circle cx="22" cy="300" r="2.2" />
      <circle cx="36" cy="298" r="1.8" />
      <path d="M44 330 C 36 318, 30 316, 30 318 M40 312 C 30 306, 24 302, 22 300" strokeWidth="0.8" />
    </svg>
  );
}
