import { memo, useRef, useState, type PointerEvent } from "react";
import backspaceIcon from "./delete_key.png";
import styles from "./NumericKeyboard.module.css";

export type NumericKeyboardSize = "small" | "large";

export interface NumericKeyboardProps {
  /** Fired immediately when a number key ("1"…"9", "0", "000") is pressed. */
  onKeyPress: (key: string) => void;
  /** Fired when the backspace key is pressed. */
  onBackspace: () => void;
  /** Fired when the backspace key is long-pressed (≥500ms) — typically "clear all". */
  onLongPressBackspace?: () => void;
  /**
   * Fired on every key-down — wire your platform's haptic bridge here.
   * (The z-taste original called ZaloPayJSBridge's rigid haptic directly;
   * the DS port leaves the bridge to the caller.)
   */
  onHaptic?: () => void;
  /** Key size: "large" (60px keys, default) or "small" (48px keys). */
  size?: NumericKeyboardSize;
  /** Extra class on the container. */
  className?: string;
}

const BACKSPACE = "←";

/** Rows of the DEFAULT layout (z-taste KEYS_CONFIG.DEFAULT): 1-9, then 0 / 000 / ⌫. */
const ROWS: string[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", "000", BACKSPACE],
];

/**
 * On-screen numeric keyboard (ported from @zpi/z-taste `NumericKeyboard` +
 * its internal `KeyPad`, DEFAULT layout). 4×3 grid: 1-9, 0, 000, backspace.
 * Press feedback = blue-tint bg + enlarged bold digit; keys debounce 50ms;
 * holding backspace ≥500ms fires `onLongPressBackspace`. Pointer-based so it
 * works with both touch and mouse. Haptics are exposed as an `onHaptic`
 * callback instead of a hard ZaloPayJSBridge dependency.
 */
function NumericKeyboardInner({
  onKeyPress,
  onBackspace,
  onLongPressBackspace,
  onHaptic,
  size = "large",
  className,
}: NumericKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const longPressTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // 50ms debounce per key (z-taste `debouncedClick`) — collapses double-fires
  // from fast repeated pointer events on the same key.
  const fireKey = (key: string) => {
    if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(() => {
      if (key === BACKSPACE) onBackspace();
      else onKeyPress(key);
      delete debounceTimers.current[key];
    }, 50);
  };

  const handleKeyDown = (key: string) => {
    setPressedKeys((prev) => [...prev, key]);
    fireKey(key);
    longPressTimers.current[key] = setTimeout(() => {
      if (key === BACKSPACE) onLongPressBackspace?.();
    }, 500);
    onHaptic?.();
  };

  const handleKeyUp = (key: string) => {
    clearTimeout(longPressTimers.current[key]);
    delete longPressTimers.current[key];
    setPressedKeys((prev) => prev.filter((k) => k !== key));
  };

  const handlePointerDown = (e: PointerEvent, key: string) => {
    if (e.pointerType === "touch" || e.pointerType === "mouse") handleKeyDown(key);
  };
  const handlePointerUp = (e: PointerEvent, key: string) => {
    if (e.pointerType === "touch" || e.pointerType === "mouse") handleKeyUp(key);
  };

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {ROWS.map((row, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          {row.map((key) => (
            <button
              key={key}
              type="button"
              className={styles.key}
              aria-label={key === BACKSPACE ? "Xóa" : key}
              onPointerDown={(e) => handlePointerDown(e, key)}
              onPointerUp={(e) => handlePointerUp(e, key)}
              onPointerLeave={(e) => handlePointerUp(e, key)}
            >
              <span
                className={[
                  styles.inner,
                  styles[size],
                  pressedKeys.includes(key) && styles.pressed,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {key === BACKSPACE ? (
                  <img src={backspaceIcon} width={31} height={20} alt="" />
                ) : (
                  key
                )}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export const NumericKeyboard = memo(NumericKeyboardInner);
export default NumericKeyboard;
