import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import { formatReward } from "./types";
import type { BadgeSkin, RevealState } from "./types";
import styles from "./RewardTagFlyToCta.module.css";

export interface RewardTagFlyToCtaProps {
  state: RevealState;
  reward: number;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
  /** S0 colour treatment being compared. */
  badgeSkin?: BadgeSkin;
}

const LAUNCH_MS = 0;

/**
 * Option 1 (per the PO's e2e idea) — value + hand-off to the CTA. S0 shows the
 * reward with a tap invite; tapping shrinks the pill to "hoàn tất thanh toán để
 * nhận xu" (guardrail 1: still one step) while the host flies the coins down
 * onto the "Tiếp tục" button (via onRevealComplete). Gold only, no green/✓
 * (guardrail 2). No count-up — S0 → S2 transitions directly.
 */
export function RewardTagFlyToCta({
  state,
  reward,
  onTap,
  onRevealComplete,
  reducedMotion,
  badgeSkin = "soft",
}: RewardTagFlyToCtaProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const s0MeasureRef = useRef<HTMLSpanElement>(null);
  const s2MeasureRef = useRef<HTMLSpanElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<{
    S0: number | null;
    S2: number | null;
  }>({ S0: null, S2: null });
  const skinClass = state === "S0" && badgeSkin !== "soft" ? styles[badgeSkin] : "";
  const renderS0Copy = () => (
    <>
      Lần đầu quét mã{" "}
      <strong className={styles.amount}>+{formatReward(reward)}</strong>
      <CoinIcon className={styles.coin} aria-hidden="true" />. Bấm để nhận
    </>
  );
  const s2Copy = "Hoàn tất thanh toán để nhận xu";

  useLayoutEffect(() => {
    const root = rootRef.current;
    const s0 = s0MeasureRef.current;
    const s2 = s2MeasureRef.current;
    if (!root || !s0 || !s2) return;

    const computed = window.getComputedStyle(root);
    const chrome =
      parseFloat(computed.paddingLeft) +
      parseFloat(computed.paddingRight) +
      parseFloat(computed.borderLeftWidth) +
      parseFloat(computed.borderRightWidth);

    setMeasuredWidth({
      S0: Math.ceil(s0.getBoundingClientRect().width + chrome),
      S2: Math.ceil(s2.getBoundingClientRect().width + chrome),
    });
  }, [state, reward, badgeSkin]);

  useEffect(() => {
    if (state !== "S2") return;
    // Launch the coin-fly in the same phase as the S0→S2 text fade-through.
    const delay = reducedMotion ? 0 : LAUNCH_MS;
    const timer = setTimeout(onRevealComplete, delay);
    return () => clearTimeout(timer);
  }, [state, reducedMotion, onRevealComplete]);

  const width = measuredWidth[state];
  const rootStyle = width
    ? ({ "--reward-tag-width": `${width}px` } as CSSProperties)
    : undefined;

  return (
    <button
      ref={rootRef}
      type="button"
      className={`${styles.root} ${state === "S0" ? styles.s0 : styles.s2} ${skinClass}`}
      style={rootStyle}
      onClick={state === "S0" ? onTap : undefined}
      aria-disabled={state !== "S0"}
      aria-live="polite"
      aria-label={
        state === "S0"
          ? `Lần đầu quét mã, cộng ${formatReward(reward)} xu. Bấm để nhận`
          : s2Copy
      }
    >
      <span ref={s0MeasureRef} className={`${styles.measure} ${styles.line}`}>
        {renderS0Copy()}
      </span>
      <span ref={s2MeasureRef} className={`${styles.measure} ${styles.settle}`}>
        {s2Copy}
      </span>
      <span className={styles.copyStack} aria-hidden="true">
        <span className={`${styles.copy} ${styles.line} ${styles.s0Copy}`}>
          {renderS0Copy()}
        </span>
        <span className={`${styles.copy} ${styles.settle} ${styles.s2Copy}`}>
          {s2Copy}
        </span>
      </span>
    </button>
  );
}

export default RewardTagFlyToCta;
