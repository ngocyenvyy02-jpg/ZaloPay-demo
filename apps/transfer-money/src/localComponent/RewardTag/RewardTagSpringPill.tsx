import { useEffect } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import type { RevealState } from "./types";
import styles from "./RewardTagSpringPill.module.css";

export interface RewardTagSpringPillProps {
  state: RevealState;
  reward: number;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const MORPH_MS = 400;

/**
 * Option 2 (brief §6) — progress-forward. The compact ①→② stepper is visible
 * from S0; opening the gift completes step 1 and promotes payment to step 2.
 */
export function RewardTagSpringPill({
  state,
  reward,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagSpringPillProps) {
  const morphing = state === "S1";
  const duration = reducedMotion ? 0 : MORPH_MS;
  const count = useCountUp(reward, duration, state !== "S0", reducedMotion);

  useEffect(() => {
    if (!morphing) return;
    const timer = setTimeout(onRevealComplete, duration);
    return () => clearTimeout(timer);
  }, [morphing, duration, onRevealComplete]);

  if (state === "S0") {
    return (
      <button
        type="button"
        className={styles.s0}
        onClick={onTap}
        aria-label="Bước 1 mở quà, bước 2 thanh toán để nhận"
      >
        <span className={styles.step}>
          <span className={styles.stepIndex}>1</span>
          <span className={styles.stepText}>Mở quà</span>
        </span>
        <span className={styles.connector} aria-hidden="true" />
        <span className={styles.step}>
          <span className={styles.stepIndex}>2</span>
          <span className={styles.stepText}>Thanh toán để nhận</span>
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${styles.root} ${morphing ? styles.morphing : ""}`}
      aria-live="polite"
    >
      <span className={styles.step}>
        <span className={`${styles.stepIndex} ${styles.stepIndexDone}`}>1</span>
        <span className={styles.stepText}>Đã mở</span>
      </span>
      <span className={styles.connector} aria-hidden="true" />
      <span className={styles.step}>
        <span className={`${styles.stepIndex} ${styles.stepIndexCurrent}`}>2</span>
        <span className={styles.stepText}>Thanh toán để nhận</span>
      </span>
      <span className={styles.rewardLine}>
        {formatReward(count)}
        <CoinIcon className={styles.coinIcon} aria-label="xu" />
      </span>
    </div>
  );
}

export default RewardTagSpringPill;
