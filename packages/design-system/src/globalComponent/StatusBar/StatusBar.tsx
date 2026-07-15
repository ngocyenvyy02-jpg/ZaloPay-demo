import styles from "./StatusBar.module.css";
import time from "../../../../../zlp-icons/Chrome/statusbar-time-941.svg";
import { SignalIcon, WifiIcon, BatteryIcon } from "./icons";

export interface StatusBarProps {
  /** Icon/text color theme. "dark" for light screens (default), "light" for dark screens. */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * iPhone 15/16 status bar with a centered Dynamic Island.
 * Time (9:41) on the left; signal / wifi / battery on the right.
 * Glyphs use currentColor so `variant` themes the whole bar.
 */
export function StatusBar({ variant = "dark", className }: StatusBarProps) {
  return (
    <div
      className={[styles.bar, variant === "light" ? styles.light : styles.dark, className]
        .filter(Boolean)
        .join(" ")}
      data-name="Status Bar"
    >
      <div className={styles.time}>
        {variant === "light" ? <span className={styles.timeText}>9:41</span> : <img src={time} alt="9:41" />}
      </div>
      <div className={styles.island} aria-hidden="true" />
      <div className={styles.right}>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}

export default StatusBar;
