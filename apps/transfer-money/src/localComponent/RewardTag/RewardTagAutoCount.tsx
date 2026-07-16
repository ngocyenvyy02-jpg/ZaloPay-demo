import { useEffect, useState } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import styles from "./RewardTagAutoCount.module.css";

export interface RewardTagAutoCountProps {
  reward: number;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const DELAY_MS = 1000;
const COUNT_MS = 900;

/**
 * Option 4 (Figma 2025:572) — no cover, no tap. The reward is visible the
 * moment the screen loads. It holds at +0 for ~1s first (mirrors the real QR
 * scan → the device loading the page/amount/note before the reward populates),
 * then the amount counts 0→reward. There is no S0 here: the tag renders its
 * revealed state directly. Copy stays "…để nhận" (guardrail 1: still one step
 * to go) and gold/navy only (guardrail 2 — no green/✓). The host remounts this
 * via its replay key, which restarts the delay + count.
 */
export function RewardTagAutoCount({
  reward,
  onRevealComplete,
  reducedMotion,
}: RewardTagAutoCountProps) {
  const duration = reducedMotion ? 0 : COUNT_MS;
  const [started, setStarted] = useState(false);
  const [landed, setLanded] = useState(false);
  const count = useCountUp(reward, duration, started, reducedMotion);

  // Hold at +0 for ~1s (the "loading" beat) before the count begins.
  useEffect(() => {
    const delay = reducedMotion ? 0 : DELAY_MS;
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [reducedMotion]);

  // Coin pop + landing haptic once the number settles.
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      setLanded(true);
      onRevealComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [started, duration, onRevealComplete]);

  return (
    <div
      className={`${styles.root} ${landed ? styles.landed : ""}`}
      aria-live="polite"
    >
      <span className={styles.line}>
        Quà lần đầu quét mã • Hoàn tất để nhận{" "}
        <strong className={styles.amount}>+ {formatReward(count)}</strong>
      </span>
      <CoinIcon className={styles.coin} aria-label="xu" />
    </div>
  );
}

export default RewardTagAutoCount;
