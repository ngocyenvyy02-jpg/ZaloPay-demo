import { useEffect, useState } from "react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import bowImg from "../../../assets/gift-bow.png";
import { useCountUp } from "./useCountUp";
import { formatReward } from "./types";
import type { RevealState } from "./types";
import styles from "./RewardTagGiftBox.module.css";

export interface RewardTagGiftBoxProps {
  state: RevealState;
  reward: number;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

const OPEN_MS = 800;

/**
 * The gift wrapping shared by both states: a glossy ribbon cross (horizontal +
 * vertical band) with a gold satin bow centered on the crossing. In S2 the same
 * wrapping animates away (`opening`) — the bow lifts + fades and the ribbons
 * dissolve, uncovering the reward line underneath.
 */
function GiftWrap({ opening = false }: { opening?: boolean }) {
  return (
    <span
      className={`${styles.wrap} ${opening ? styles.wrapOpening : ""}`}
      aria-hidden="true"
    >
      <span className={styles.lid} />
      <span className={styles.ribbonH} />
      <span className={styles.ribbonV} />
      <img className={styles.bow} src={bowImg} alt="" />
    </span>
  );
}

/**
 * Option 2 — gift-box open, matching the PO's Figma demo (node 2011:518): the
 * tag *is* the wrapped gift. S0 is a pale capsule wrapped with a ribbon cross +
 * gold bow; tapping unwraps it (bow lifts + fades, ribbons dissolve, a soft glow
 * + a few sparkles — NOT confetti, guardrail 2) while the reward counts up,
 * settling on the shared "...sau khi thanh toán" line inside the opened cavity
 * (guardrail 1: still one step to go).
 */
export function RewardTagGiftBox({
  state,
  reward,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagGiftBoxProps) {
  const duration = reducedMotion ? 0 : OPEN_MS;
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
        className={`${styles.pill} ${styles.pillClosed}`}
        onClick={onTap}
        aria-label="Có quà cho bạn — chạm để mở"
      >
        <GiftWrap />
      </button>
    );
  }

  return (
    <div
      className={`${styles.s2Scene} ${landed ? styles.landed : ""}`}
      aria-live="polite"
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.sparkles} aria-hidden="true">
        <span className={styles.sparkle} />
        <span className={styles.sparkle} />
        <span className={styles.sparkle} />
        <span className={styles.sparkle} />
        <span className={styles.sparkle} />
        <span className={styles.sparkle} />
      </span>
      <div className={`${styles.pill} ${styles.pillOpen}`}>
        <span className={styles.pillInner}>
          <span className={styles.s2Line}>
            Yeah! Bạn sẽ nhận được{" "}
            <strong className={styles.s2Amount}>{formatReward(count)}</strong>
            <CoinIcon className={styles.coinIcon} aria-label="xu" /> sau khi thanh
            toán
          </span>
        </span>
        <GiftWrap opening />
      </div>
    </div>
  );
}

export default RewardTagGiftBox;
