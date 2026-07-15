import { useEffect } from "react";
import GiftIcon from "../../../../../zlp-icons/Second/general_gift.svg?react";
import GiftOpenIcon from "../../../../../zlp-icons/Second/general_giftopen.svg?react";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import type { RevealState } from "./types";
import styles from "./RewardTagWipe.module.css";

export interface RewardTagWipeProps {
  state: Extract<RevealState, "S0" | "S1">;
  reward: number;
  merchantLabel: string;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const WIPE_MS = 600;

/**
 * Option 3 (brief §6, PO-recommended) — scratch-card model. This owns BOTH S0
 * (chip sits fully COVERED by a foil layer, like an unscratched card) and S1
 * (one tap wipes the foil away left→right revealing the gold reward + count-up).
 * S0 here is a foil cover, NOT the shared gift pill, so the resting tag already
 * reads as "a card to scratch". After reveal it hands off to RewardTagS2Default.
 */
export function RewardTagWipe({
  state,
  reward,
  merchantLabel,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagWipeProps) {
  const wiping = state === "S1";
  const duration = reducedMotion ? 0 : WIPE_MS;
  const count = useCountUp(reward, duration, wiping, reducedMotion);

  useEffect(() => {
    if (!wiping) return;
    const timer = setTimeout(onRevealComplete, duration);
    return () => clearTimeout(timer);
  }, [wiping, duration, onRevealComplete]);

  const inner = (
    <>
      <div className={styles.revealed}>
        <GiftOpenIcon className={styles.giftIcon} aria-hidden="true" />
        <span className={styles.revealedText}>Đang mở quà ·</span>
        <span className={styles.count}>
          {formatReward(wiping ? count : reward)} xu
        </span>
      </div>
      <div
        className={`${styles.cover} ${wiping ? styles.coverWiping : ""}`}
        aria-hidden="true"
      >
        <span className={styles.coverText}>Cào mở quà lần đầu</span>
        <GiftIcon className={styles.coverGift} />
        <span className={styles.shimmer} />
      </div>
    </>
  );

  if (state === "S0") {
    return (
      <button
        type="button"
        className={styles.root}
        onClick={onTap}
        aria-label={`Cào mở quà lần đầu khi quét mã ${merchantLabel}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={styles.root} aria-live="polite">
      {inner}
    </div>
  );
}

export default RewardTagWipe;
