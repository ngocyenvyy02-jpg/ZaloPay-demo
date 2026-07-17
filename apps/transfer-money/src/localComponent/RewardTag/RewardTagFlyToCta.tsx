import { useEffect } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import { formatReward } from "./types";
import type { BadgeSkin, RevealState } from "./types";
import styles from "./RewardTagFlyToCta.module.css";

export interface RewardTagFlyToCtaProps {
  state: RevealState;
  reward: number;
  /** Merchant name shown in the S0 copy ("Lần đầu quét mã {merchant}"). */
  merchantLabel: string;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
  /** S0 colour treatment being compared. */
  badgeSkin?: BadgeSkin;
}

const LAUNCH_MS = 180;

/**
 * Option 1 (per the PO's e2e idea) — value + hand-off to the CTA. S0 shows the
 * reward with a tap invite; tapping crossfades to "hoàn tất thanh toán để nhận
 * xu" (guardrail 1: still one step) and, a beat later, the host flies the coins
 * down onto the "Tiếp tục" button (via onRevealComplete). Gold only, no green/✓
 * (guardrail 2). No count-up — S0 → S2 fades directly.
 */
export function RewardTagFlyToCta({
  state,
  reward,
  merchantLabel,
  onTap,
  onRevealComplete,
  reducedMotion,
  badgeSkin = "soft",
}: RewardTagFlyToCtaProps) {
  const skinClass = badgeSkin === "soft" ? "" : styles[badgeSkin];

  useEffect(() => {
    if (state !== "S2") return;
    // Launch the coin-fly a beat after the tap so S0→S2 reads as one smooth move.
    const delay = reducedMotion ? 0 : LAUNCH_MS;
    const timer = setTimeout(onRevealComplete, delay);
    return () => clearTimeout(timer);
  }, [state, reducedMotion, onRevealComplete]);

  if (state === "S0") {
    return (
      <button
        type="button"
        className={`${styles.root} ${styles.s0} ${skinClass}`}
        onClick={onTap}
        aria-label={`Lần đầu quét mã ${merchantLabel}, cộng ${formatReward(reward)} xu. Chạm để nhận`}
      >
        <span className={styles.line}>
          Lần đầu quét mã {merchantLabel}{" "}
          <strong className={styles.amount}>+{formatReward(reward)}</strong>
          <CoinIcon className={styles.coin} aria-hidden="true" />. Chạm để nhận
        </span>
      </button>
    );
  }

  return (
    <div className={styles.root} aria-live="polite">
      <span className={styles.settle}>Hoàn tất thanh toán để nhận xu</span>
    </div>
  );
}

export default RewardTagFlyToCta;
