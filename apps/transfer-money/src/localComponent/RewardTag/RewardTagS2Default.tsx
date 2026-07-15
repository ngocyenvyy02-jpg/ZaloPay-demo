import GiftOpenIcon from "../../../../../zlp-icons/Second/general_giftopen.svg?react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import { formatReward } from "./types";
import styles from "./RewardTagS2Default.module.css";

export interface RewardTagS2DefaultProps {
  reward: number;
}

/**
 * S2 — reserved, shared markup for Option 1 & 3 (brief §6/§8). Gold/navy only:
 * guardrail 2 reserves ✓ green exclusively for the real S3 success screen.
 */
export function RewardTagS2Default({ reward }: RewardTagS2DefaultProps) {
  return (
    <div className={styles.root} aria-live="polite">
      <GiftOpenIcon className={styles.giftIcon} aria-hidden="true" />
      <span className={styles.text}>Đã mở quà! Thanh toán để nhận</span>
      <span className={styles.reward}>
        <strong>{formatReward(reward)}</strong>
        <CoinIcon className={styles.coinIcon} aria-label="xu" />
      </span>
    </div>
  );
}

export default RewardTagS2Default;
