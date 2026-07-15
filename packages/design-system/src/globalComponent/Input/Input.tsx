import { useId, useState, type ReactNode } from "react";
import ClearIcon from "./clear.svg?react";
import ErrorIcon from "./error.svg?react";
import styles from "./Input.module.css";

export type InputSize = "S" | "M" | "L";

export interface InputProps {
  /** Current value. Controlled — pair with `onChange`. */
  value: string;
  /** Fired on every change (already-unformatted value when `numeric`). */
  onChange?: (value: string) => void;
  /** Placeholder shown when empty. */
  placeholder?: string;
  /**
   * Field label above the input. Rendered for size M/L only — size S has no
   * label (per the design system spec).
   */
  label?: string;
  /** S (radius 8, no label) · M/L (radius 12, with label). Default "M". */
  size?: InputSize;
  /**
   * Error state. A string shows as the error hint text; `true` shows the error
   * styling with no text. Error always renders the error icon + red border.
   */
  error?: string | boolean;
  /** Helper hint under the field (neutral; overridden by `error`). */
  hint?: string;
  /** Disabled: greyed background, no interaction. */
  disabled?: boolean;
  /** Optional trailing icon (right side, before/after the clear button). */
  rightIcon?: ReactNode;
  /**
   * Numeric mode: displays the value with thousands separators (1.000.000)
   * while `onChange` still receives the raw digits.
   */
  numeric?: boolean;
  /** Native input type (ignored when `numeric`). */
  type?: string;
  /** Form field name. */
  name?: string;
  /** Extra class on the outer wrapper. */
  className?: string;
}

/** 1000000 -> "1.000.000" (dot thousands separator, per DS spec). */
function formatThousands(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Zalopay Input field (Design System 3.0). Covers the full state matrix via
 * composed props rather than a 9-value enum:
 *   - empty vs typed (placeholder vs value)
 *   - focused (blue border + cursor) — internal state
 *   - error (red border + hint + icon) — `error` prop
 *   - disabled — `disabled` prop
 * Clear button shows only while focused AND non-empty (hidden on blur), with a
 * 40×40 hit area. Sizes S/M/L differ in radius and label (S has no label).
 * Colors/spacing come from design tokens. Controlled: parent owns `value`.
 */
export function Input({
  value,
  onChange,
  placeholder,
  label,
  size = "M",
  error,
  hint,
  disabled = false,
  rightIcon,
  numeric = false,
  type = "text",
  name,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();

  const hasError = error !== undefined && error !== false && error !== "";
  const errorText = typeof error === "string" ? error : "";
  const showLabel = size !== "S" && !!label;
  const showClear = focused && value !== "" && !disabled;
  const displayValue = numeric ? formatThousands(value) : value;

  const handleChange = (raw: string) => {
    onChange?.(numeric ? raw.replace(/\D/g, "") : raw);
  };

  const rootClass = [
    styles.root,
    styles[`size${size}`],
    hasError && styles.error,
    disabled && styles.disabled,
    focused && styles.focused,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className={styles.field}>
        {/* Content column: label (inside the box, above) + the input line. */}
        <div className={styles.content}>
          {showLabel && (
            <label className={styles.label} htmlFor={inputId}>
              {label}
            </label>
          )}
          <input
            id={inputId}
            className={styles.input}
            value={displayValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            type={numeric ? "text" : type}
            inputMode={numeric ? "numeric" : undefined}
          />
        </div>

        {(showClear || rightIcon) && (
          <div className={styles.trailing}>
            {showClear && (
              <button
                type="button"
                className={styles.clear}
                aria-label="Clear"
                // onMouseDown (not onClick) so it fires before the input blurs.
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange?.("");
                }}
              >
                <ClearIcon className={styles.clearIcon} />
              </button>
            )}
            {showClear && rightIcon && <span className={styles.divider} />}
            {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
          </div>
        )}
      </div>

      {(hasError || hint) && (
        <div className={styles.hint}>
          {hasError && (
            <span className={styles.hintIconWrap}>
              <ErrorIcon className={styles.hintIcon} />
            </span>
          )}
          <span className={styles.hintText}>{hasError ? errorText : hint}</span>
        </div>
      )}
    </div>
  );
}

export default Input;
