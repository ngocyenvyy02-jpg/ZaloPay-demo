import RefreshIcon from "../../../../../zlp-icons/Second/general_refresh.svg?react";
import type { BadgeSkin, Merchant, OptionId, SegmentId } from "../RewardTag";
import styles from "./DemoControlPanel.module.css";

export interface DemoControlPanelProps {
  option: OptionId;
  onOptionChange: (option: OptionId) => void;
  segment: SegmentId;
  onSegmentChange: (segment: SegmentId) => void;
  merchant: Merchant;
  onMerchantChange: (merchant: Merchant) => void;
  badgeSkin: BadgeSkin;
  onBadgeSkinChange: (skin: BadgeSkin) => void;
  onReplay: () => void;
}

const OPTIONS: OptionId[] = [1, 2, 3, 4];
const SEGMENTS: SegmentId[] = ["N", "F", "R"];
const MERCHANTS: Merchant[] = ["BHX", "WINMART"];
const MERCHANT_SHORT: Record<Merchant, string> = { BHX: "BHX", WINMART: "WM" };
const SKINS: BadgeSkin[] = ["soft", "bold", "gradient"];
const SKIN_SHORT: Record<BadgeSkin, string> = {
  soft: "Nhạt",
  bold: "Đậm",
  gradient: "Grad",
};

/** Dev-only comparison tool (brief §9) — pick reveal option, segment, merchant; replay. */
export function DemoControlPanel({
  option,
  onOptionChange,
  segment,
  onSegmentChange,
  merchant,
  onMerchantChange,
  badgeSkin,
  onBadgeSkinChange,
  onReplay,
}: DemoControlPanelProps) {
  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <span className={styles.label}>Option</span>
        <div className={styles.seg}>
          {OPTIONS.map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.segBtn} ${option === id ? styles.segOn : ""}`}
              onClick={() => onOptionChange(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Segment</span>
        <div className={styles.seg}>
          {SEGMENTS.map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.segBtn} ${segment === id ? styles.segOn : ""}`}
              onClick={() => onSegmentChange(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Merchant</span>
        <div className={styles.seg}>
          {MERCHANTS.map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.segBtn} ${merchant === id ? styles.segOn : ""}`}
              onClick={() => onMerchantChange(id)}
            >
              {MERCHANT_SHORT[id]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Màu</span>
        <div className={styles.seg}>
          {SKINS.map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.segBtn} ${badgeSkin === id ? styles.segOn : ""}`}
              onClick={() => onBadgeSkinChange(id)}
            >
              {SKIN_SHORT[id]}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.replayBtn}
        onClick={onReplay}
        aria-label="Replay demo"
      >
        <RefreshIcon aria-hidden="true" />
      </button>
    </div>
  );
}

export default DemoControlPanel;
