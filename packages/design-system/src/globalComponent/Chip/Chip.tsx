import type { ButtonHTMLAttributes, ReactNode } from "react";
import Chevron from "./chevron.svg?react";
import styles from "./Chip.module.css";

export type ChipVariant = "outlined" | "elevated";
export type ChipSize = "24" | "32" | "36";

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange"> {
  /** Whether the chip is active/selected. Controlled — pair with `onChange`. */
  selected: boolean;
  /** Fired on tap with the toggled value (never fires while disabled). */
  onChange?: (selected: boolean) => void;
  /** Chip label. */
  children: ReactNode;
  /** Outlined (border) or Elevated (tonal background). Default "outlined". */
  variant?: ChipVariant;
  /**
   * Height tier: 24 (px8) / 32 (px12) / 36 (px12). Same font (14/18) and
   * icons (16) at every size. Default "24".
   */
  size?: ChipSize;
  /** Optional leading icon (16px slot, tinted via currentColor). */
  leading?: ReactNode;
  /**
   * Optional trailing icon (16px slot, tinted via currentColor). For the
   * dropdown chevron use the exported `ChipChevron`.
   */
  trailing?: ReactNode;
}

/**
 * Zalopay filter chip (Design System 3.0, set 89779:34235 — size 24 scope).
 * Pill (radius 100), h24, px8, gap4, label Regular 14/18, icons 16px.
 * States per Figma:
 *   outlined — enabled: white bg + 1px dark-25 border, text primary-dark;
 *              selected: blue border + blue text; disabled: dark-25 bg+border,
 *              text dark-100.
 *   elevated — enabled: other-background (#F5F9FF) tonal bg, no border;
 *              selected: blue-25 bg + blue text; disabled: dark-25 bg,
 *              text dark-100.
 * Icons inherit the state color via currentColor. Controlled toggle.
 * `leading`/`trailing` are generic 16px icon slots (trailing isn't always a
 * chevron) — `ChipChevron` is exported for the dropdown case.
 */
export function Chip({
  selected,
  onChange,
  children,
  variant = "outlined",
  size = "24",
  leading,
  trailing,
  disabled = false,
  className,
  onClick,
  ...rest
}: ChipProps) {
  const cls = [
    styles.root,
    styles[variant],
    styles[`size${size}`],
    selected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      aria-pressed={selected}
      {...rest}
      onClick={(e) => {
        onChange?.(!selected);
        onClick?.(e);
      }}
    >
      {leading && <span className={styles.icon}>{leading}</span>}
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.icon}>{trailing}</span>}
    </button>
  );
}

/** The dropdown chevron used by filter chips (zlp-icons general_arrow_down4). */
export const ChipChevron = Chevron;

export default Chip;
