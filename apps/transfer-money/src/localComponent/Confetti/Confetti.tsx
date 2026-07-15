import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./Confetti.module.css";

const COLORS = [
  "var(--color-variant-orange-400, #ffa50a)",
  "var(--color-variant-green-400, #33f596)",
  "var(--color-primary-blue, #0033c9)",
  "var(--color-variant-orange-200, #ffd96d)",
];

const PIECE_COUNT = 20;
const LIFETIME_MS = 1500;

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 200,
    duration: 900 + Math.random() * 500,
    color: COLORS[id % COLORS.length],
    rotate: 180 + Math.random() * 360,
  }));
}

/** Confetti burst mounted on S3 payoff only (dependency-free — no lib exists in the repo). */
export function Confetti() {
  const reducedMotion = usePrefersReducedMotion();
  const [pieces] = useState<Piece[]>(() => (reducedMotion ? [] : makePieces()));
  const [visible, setVisible] = useState(pieces.length > 0);

  useEffect(() => {
    if (pieces.length === 0) return;
    const timer = setTimeout(() => setVisible(false), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [pieces.length]);

  if (!visible) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={styles.piece}
          style={
            {
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}ms`,
              animationDuration: `${piece.duration}ms`,
              background: piece.color,
              "--rot": `${piece.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default Confetti;
