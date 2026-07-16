import { useEffect, useState } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import GiftIcon from "../../../../../zlp-icons/Second/general_gift.svg?react";
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
 * Option 1 (brief §6) — value-forward. Tap jumps straight to S2, where the
 * amount counts 0→reward inside the "you'll receive X after paying" line; the
 * coin pops once the number lands.
 */
export function RewardTagCountUp({
  state,
  reward,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagCountUpProps) {
  const duration = reducedMotion ? 0 : REVEAL_MS;
  const count = useCountUp(reward, duration, state === "S2", reducedMotion);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (state !== "S2") {
      setLanded(false);
      return;
    }
    const timer = setTimeout(() => {
      setLanded(true);
      onRevealComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [state, duration, onRevealComplete]);

  if (state === "S0") {
    return (
      <button
        type="button"
        className={`${styles.root} ${styles.s0}`}
        onClick={onTap}
        aria-label="Bạn có quà cho lần đầu quét mã. Chạm để mở"
      >
        <GiftIcon className={styles.giftIcon} aria-hidden="true" />
        <span className={styles.label}>
          Bạn có quà cho lần đầu quét mã. Chạm để mở
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${styles.root} ${styles.s2} ${landed ? styles.landed : ""}`}
      aria-live="polite"
    >
      <span className={styles.s2Line}>
        Yeah! Bạn sẽ nhận được{" "}
        <strong className={styles.s2Amount}>{formatReward(count)}</strong>
        <CoinIcon className={styles.coinIcon} aria-label="xu" /> sau khi thanh toán
      </span>
    </div>
  );
}

export default RewardTagCountUp;
