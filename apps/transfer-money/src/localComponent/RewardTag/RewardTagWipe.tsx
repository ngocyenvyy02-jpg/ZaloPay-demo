import { useEffect, useState } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import GiftIcon from "../../../../../zlp-icons/Second/general_gift.svg?react";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import type { RevealState } from "./types";
import styles from "./RewardTagWipe.module.css";

export interface RewardTagWipeProps {
  state: RevealState;
  reward: number;
  merchantLabel: string;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const WIPE_MS = 600;

/**
 * Option 3 (brief §6, PO-recommended) — scratch card. S0 sits fully COVERED by
 * a foil layer, like an unscratched card. Tap jumps to S2: the foil wipes away
 * left→right revealing the "you'll receive X after paying" line with the amount
 * counting up; the coin pops as it lands. No separate S1.
 */
export function RewardTagWipe({
  state,
  reward,
  merchantLabel,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagWipeProps) {
  const revealing = state === "S2";
  const duration = reducedMotion ? 0 : WIPE_MS;
  const count = useCountUp(reward, duration, revealing, reducedMotion);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!revealing) {
      setLanded(false);
      return;
    }
    const timer = setTimeout(() => {
      setLanded(true);
      onRevealComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [revealing, duration, onRevealComplete]);

  const inner = (
    <>
      <div className={styles.revealed}>
        <span className={styles.revealedText}>
          Yeah! Bạn sẽ nhận được{" "}
          <strong className={styles.amount}>
            {formatReward(revealing ? count : reward)}
          </strong>
          <CoinIcon className={styles.coinIcon} aria-label="xu" /> sau khi thanh
          toán
        </span>
      </div>
      <div
        className={`${styles.cover} ${revealing ? styles.coverWiping : ""}`}
        aria-hidden="true"
      >
        <span className={styles.coverText}>Bạn có phần quà đang chờ. Cào ngay</span>
        <GiftIcon className={styles.coverGift} />
        {!revealing && <span className={styles.shimmer} />}
      </div>
    </>
  );

  if (state === "S0") {
    return (
      <button
        type="button"
        className={styles.root}
        onClick={onTap}
        aria-label={`Bạn có phần quà đang chờ, cào để mở khi quét mã ${merchantLabel}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={`${styles.root} ${landed ? styles.landed : ""}`}
      aria-live="polite"
    >
      {inner}
    </div>
  );
}

export default RewardTagWipe;
