import { useEffect, type CSSProperties } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import styles from "./CoinFly.module.css";

export interface Point {
  x: number;
  y: number;
}

export interface CoinFlyProps {
  /** Burst origin — the reward tag centre (px, relative to the host root). */
  from: Point;
  /** Landing point — the "Tiếp tục" CTA centre (px, relative to the host root). */
  to: Point;
  reducedMotion: boolean;
  /** Fired once the last coin lands, so the host can light up the CTA. */
  onDone: () => void;
}

const COINS = 6;
const FLY_MS = 700;
const STAGGER_MS = 55;

/**
 * A short burst of gold coins that arcs from the reward tag down onto the
 * "Tiếp tục" CTA — the "collect → now go claim" gesture that drives the e2e
 * story (guardrail-safe: gold coins, not confetti/✓). Under reduced motion it
 * renders nothing and calls onDone immediately.
 */
export function CoinFly({ from, to, reducedMotion, onDone }: CoinFlyProps) {
  useEffect(() => {
    const total = reducedMotion ? 0 : FLY_MS + COINS * STAGGER_MS;
    const timer = setTimeout(onDone, total);
    return () => clearTimeout(timer);
  }, [onDone, reducedMotion]);

  if (reducedMotion) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  return (
    <div className={styles.layer} aria-hidden="true">
      {Array.from({ length: COINS }).map((_, i) => {
        const spread = (i - (COINS - 1) / 2) * 12;
        const style = {
          left: `${from.x}px`,
          top: `${from.y}px`,
          animationDelay: `${i * STAGGER_MS}ms`,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          "--spread": `${spread}px`,
          "--lift": `${-18 - Math.abs(spread) * 0.4}px`,
        } as CSSProperties;
        return <CoinIcon key={i} className={styles.coin} style={style} />;
      })}
    </div>
  );
}

export default CoinFly;
