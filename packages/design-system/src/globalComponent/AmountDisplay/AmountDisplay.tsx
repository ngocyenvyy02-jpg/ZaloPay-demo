import { useEffect, useRef, useState } from "react";
import styles from "./AmountDisplay.module.css";

export type AmountTextAlign = "left" | "center" | "right";

export interface AmountDisplayProps {
  /** Raw digit string ("150000") — formatted with thousand separators at render. */
  value: string;
  /** Unit label after the number. */
  unit?: string;
  /** Error message under the number — fades in/out; pair with `shake`. */
  error?: string;
  /** Trigger the 250ms error shake. Set true on the error burst, reset after. */
  shake?: boolean;
  /** Show the blinking fake cursor (default true — no real input element). */
  cursor?: boolean;
  /**
   * Digit font size in px at full width (default 48). Overflow auto-shrinks to
   * ~0.83× of this. The row height and the shrunk size track it via a CSS var.
   */
  size?: number;
  textAlign?: AmountTextAlign;
  className?: string;
}

/** "150000" → "150.000" (vi-VN grouping; z-taste used de-DE — same separators). */
const format = (v: string) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? "0" : n.toLocaleString("vi-VN");
};

// z-taste NumberDisplay ANIMATION_DURATION — exact values, no DS tokens match.
const REMOVE_MS = 100;

/**
 * Big amount read-out for on-screen-keyboard flows (ported from @zpi/z-taste
 * `NumberDisplay`, styled-components → CSS Modules, KeyboardContext removed).
 * The digits render as individual chars and only the LAST one animates: fade-in
 * on type, and on delete the old value is kept on screen for 100ms so the
 * fade-out can play (exit animation without AnimatePresence). The cursor is a
 * FAKE blinking span — there is no input element, so the OS keyboard never
 * appears; drive `value` from `NumericKeyboard`. Digit size is configurable
 * (`size`, default 48px) and auto-shrinks ~0.83× on overflow; `shake` + `error` give multimodal
 * error feedback (pair with the `haptic` util in a ZaloPay webview).
 */
export function AmountDisplay({
  value,
  unit = "₫",
  error,
  shake = false,
  cursor = true,
  size = 48,
  textAlign = "center",
  className,
}: AmountDisplayProps) {
  const [chars, setChars] = useState<string[]>(() => format(value).split(""));
  const [dir, setDir] = useState<"add" | "remove" | "none">("none");
  const [small, setSmall] = useState(false);
  const [errStage, setErrStage] = useState<"in" | "out" | "none">(error ? "in" : "none");
  const prevLen = useRef(value.length);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  // Add = re-render immediately (new last char mounts with fade-in). Remove =
  // keep the OLD chars for 100ms so the last one can fade out, THEN commit.
  useEffect(() => {
    const before = prevLen.current;
    prevLen.current = value.length;

    if (value.length < before) {
      setDir("remove");
      const t = setTimeout(() => {
        setChars(format(value).split(""));
        setDir("none");
      }, REMOVE_MS);
      return () => clearTimeout(t);
    }
    setDir(value.length > before ? "add" : "none");
    setChars(format(value).split(""));
  }, [value]);

  // Overflow → shrink to the smaller size. Compare the content row against the
  // available width of the full-width root; a small margin absorbs sub-pixel /
  // cursor+unit slack so a fitting number never shrinks. Hysteresis (0.83 re-grow
  // threshold) stops flip-flopping at the boundary since width tracks font size.
  useEffect(() => {
    const check = () => {
      const wrap = wrapRef.current;
      const row = rowRef.current;
      if (!wrap || !row) return;
      const avail = wrap.clientWidth;
      setSmall((prev) => (prev ? row.scrollWidth > avail * 0.83 : row.scrollWidth > avail - 1));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [chars]);

  // Error text fades in on message, fades out on clear (50ms, z-taste ERROR).
  useEffect(() => {
    if (error) {
      setErrStage("in");
      return;
    }
    setErrStage((prev) => (prev === "in" ? "out" : "none"));
  }, [error]);

  const lastIndex = chars.length - 1;

  return (
    <div
      ref={wrapRef}
      className={[styles.root, styles[textAlign], className].filter(Boolean).join(" ")}
      style={{ ["--amount-size" as string]: `${size}px` }}
    >
      <div
        ref={rowRef}
        className={[styles.row, small && styles.small, shake && styles.shake]
          .filter(Boolean)
          .join(" ")}
      >
        {chars.map((char, index) => (
          <span
            key={`${index}-${char}`}
            className={[
              styles.digit,
              index === lastIndex && dir === "add" && styles.digitIn,
              index === lastIndex && dir === "remove" && styles.digitOut,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {char}
          </span>
        ))}
        <span className={styles.tail} style={{ right: cursor ? -22 : -12 }}>
          {cursor && <span className={styles.cursor} aria-hidden="true" />}
          <span className={styles.unit}>{unit}</span>
        </span>
      </div>
      {errStage !== "none" && (
        <div className={[styles.error, errStage === "out" && styles.errorOut].filter(Boolean).join(" ")}>
          {error}
        </div>
      )}
    </div>
  );
}

export default AmountDisplay;
