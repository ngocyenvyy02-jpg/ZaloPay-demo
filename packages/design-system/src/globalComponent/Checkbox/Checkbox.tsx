import type { ReactNode } from "react";
import CheckedIcon from "./checked.svg?react";
import UncheckedIcon from "./unchecked.svg?react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  /** Whether this checkbox is checked. Controlled — pair with `onChange`. */
  checked: boolean;
  /** Disabled checkboxes are dimmed and ignore interaction. */
  disabled?: boolean;
  /** Optional label rendered next to the box. Clicking it toggles. */
  label?: ReactNode;
  /** Fired when the user toggles (never fires while disabled). */
  onChange?: (checked: boolean) => void;
  /** Form field name. */
  name?: string;
  /** This checkbox's value. */
  value?: string;
  /** Extra class on the label wrapper. */
  className?: string;
}

/**
 * Zalopay checkbox (Figma "checkbox", node 560:4897). The box/tick are real
 * exported Figma SVGs (checked.svg / unchecked.svg) imported as React
 * components via svgr (`?react`). The box uses `currentColor`, so CSS `color`
 * drives it per state from design tokens — checked = primary-blue, unchecked =
 * variant-dark-100, disabled = variant-dark-200; the tick is fixed white in the
 * SVG. Controlled: parent owns `checked`.
 */
export function Checkbox({
  checked,
  disabled = false,
  label,
  onChange,
  name,
  value,
  className,
}: CheckboxProps) {
  return (
    <label
      className={[styles.root, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={styles.box} aria-hidden="true">
        {checked ? <CheckedIcon /> : <UncheckedIcon />}
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
    </label>
  );
}

export default Checkbox;
