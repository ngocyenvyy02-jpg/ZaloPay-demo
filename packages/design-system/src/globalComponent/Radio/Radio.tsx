import type { ReactNode } from "react";
import CheckedIcon from "./checked.svg?react";
import UncheckedIcon from "./unchecked.svg?react";
import styles from "./Radio.module.css";

export interface RadioProps {
  /** Whether this radio is selected. Controlled — pair with `onChange`. */
  checked: boolean;
  /** Disabled radios are dimmed and ignore interaction. */
  disabled?: boolean;
  /** Optional label rendered next to the ring. Clicking it toggles selection. */
  label?: ReactNode;
  /** Fired when the user selects this radio (never fires while disabled). */
  onChange?: (checked: boolean) => void;
  /** Group name — set the same on radios that are mutually exclusive. */
  name?: string;
  /** This radio's value within its group. */
  value?: string;
  /** Extra class on the label wrapper. */
  className?: string;
}

/**
 * Zalopay radio (Figma "radiobox", node 560:4926). The ring/dot are the real
 * exported Figma SVGs (checked.svg = ring + dot, unchecked.svg = ring outline)
 * imported via svgr (`?react`). They use `currentColor`, so CSS `color` drives
 * the state color from design tokens — checked = primary-blue, unchecked =
 * variant-dark-100, disabled = variant-dark-200. Controlled: parent owns
 * `checked`.
 */
export function Radio({
  checked,
  disabled = false,
  label,
  onChange,
  name,
  value,
  className,
}: RadioProps) {
  return (
    <label
      className={[styles.root, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={styles.ring} aria-hidden="true">
        {checked ? <CheckedIcon /> : <UncheckedIcon />}
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
    </label>
  );
}

export default Radio;
