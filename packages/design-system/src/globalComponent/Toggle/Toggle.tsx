import type { ReactNode } from "react";
import styles from "./Toggle.module.css";

export type ToggleSize = "M" | "S";

export interface ToggleProps {
  /** Whether the toggle is on. Controlled — pair with `onChange`. */
  checked: boolean;
  /** Disabled toggles are dimmed and ignore interaction. */
  disabled?: boolean;
  /** Size: "M" (40×24) or "S" (32×20). Default "M". */
  size?: ToggleSize;
  /** Optional label rendered next to the track. Clicking it toggles. */
  label?: ReactNode;
  /** Fired when the user toggles (never fires while disabled). */
  onChange?: (checked: boolean) => void;
  /** Form field name. */
  name?: string;
  /** Extra class on the label wrapper. */
  className?: string;
}

/**
 * Zalopay toggle / switch (Figma "Toggle", node 560:37695). Pill track + white
 * knob that slides. Geometry read from Figma: M = 40×24 track, 20px knob, 2px
 * padding; S = 32×20 track, 16px knob, 2px padding. Track on = primary-blue,
 * off = variant-dark-100; knob white with the design's drop shadow. Controlled:
 * parent owns `checked`.
 */
export function Toggle({
  checked,
  disabled = false,
  size = "M",
  label,
  onChange,
  name,
  className,
}: ToggleProps) {
  return (
    <label
      className={[styles.root, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={`${styles.track} ${styles[size === "S" ? "sizeS" : "sizeM"]}`} aria-hidden="true">
        <span className={styles.knob} />
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
    </label>
  );
}

export default Toggle;
