import { useEffect } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import GiftIcon from "../../../../../zlp-icons/Second/general_gift.svg?react";
import GiftOpenIcon from "../../../../../zlp-icons/Second/general_giftopen.svg?react";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import type { RevealState } from "./types";
import styles from "./RewardTagCountUp.module.css";

export interface RewardTagCountUpProps {
  state: RevealState;
  reward: number;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const REVEAL_MS = 400;

/**
 * Option 1 (brief §6) — value-forward. The reward is visually dominant from
 * S0, counts 0→reward in S1, then remains the focal point in S2.
 */
export function RewardTagCountUp({
  state,
  reward,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagCountUpProps) {
  const revealing = state === "S1";
  const duration = reducedMotion ? 0 : REVEAL_MS;
  const count = useCountUp(reward, duration, state !== "S0", reducedMotion);

  useEffect(() => {
    if (!revealing) return;
    const timer = setTimeout(onRevealComplete, duration);
    return () => clearTimeout(timer);
  }, [revealing, duration, onRevealComplete]);

  if (state === "S0") {
    return (
      <button
        type="button"
        className={`${styles.root} ${styles.s0}`}
        onClick={onTap}
        aria-label="Chạm để mở quà lần đầu tiên"
      >
        <GiftIcon className={styles.giftIcon} aria-hidden="true" />
        <span className={styles.label}>Chạm để mở quà lần đầu tiên</span>
      </button>
    );
  }

  return (
    <div
      className={`${styles.root} ${revealing ? styles.s1 : ""}`}
      aria-live="polite"
    >
      <GiftOpenIcon
        className={`${styles.giftIcon} ${styles.giftIconOpen}`}
        aria-hidden="true"
      />
      <span className={styles.label}>
        {revealing ? "Đang mở quà ·" : "Thanh toán để nhận"}
      </span>
      <span className={styles.count}>
        {formatReward(count)}
        <CoinIcon className={styles.coinIcon} aria-label="xu" />
      </span>
    </div>
  );
}

export default RewardTagCountUp;
