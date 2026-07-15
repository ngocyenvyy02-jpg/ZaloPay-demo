import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./Slider.module.css";

export type SliderVariant = "free" | "step";

export interface SliderProps {
  /** Current value. Controlled — pair with `onChange`. */
  value: number;
  /** Range bounds. Default 0–100. */
  min?: number;
  max?: number;
  /**
   * Fired continuously while dragging / on keyboard step. In "step" mode the
   * value is already snapped to the nearest `step` mark.
   */
  onChange?: (value: number) => void;
  /**
   * - "free" (default): the knob drags smoothly to any value in range.
   * - "step": marks are drawn along the track and the knob snaps to the
   *   nearest one. `step` sets the interval; `min`/`max` are always marks.
   */
  variant?: SliderVariant;
  /** Snap interval for "step" mode (also the mark spacing). Default 10. */
  step?: number;
  /** Fixed labels under the track ends (e.g. "1 triệu" / "100 triệu"). */
  minLabel?: ReactNode;
  maxLabel?: ReactNode;
  /** Disabled sliders are dimmed and ignore interaction. */
  disabled?: boolean;
  /** Extra class on the root. */
  className?: string;
  /** Accessible name for the slider (falls back to "Slider"). */
  "aria-label"?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Zalopay range Slider (Figma "Slider container", nodes 51:648 step / 51:688
 * free). Pill track (6px) with a blue fill, a 24px white knob with the design's
 * drop shadow, and optional fixed min/max labels underneath. Two variants:
 * "free" drags to any value; "step" draws evenly-spaced marks and snaps the
 * knob to the nearest one (10 marks in the source design). Controlled: parent
 * owns `value`. Drag uses pointer capture (same pattern as Sheet); the track
 * fill/knob move via CSS `left`% so a fast drag retargets instead of restarting.
 *
 * Geometry & tokens read from Figma: track #eef4fe → --color-other-stroke2,
 * fill #0033c9 → --color-primary-blue, knob #fff → --color-primary-white,
 * labels 12/16 SF Pro Regular #99a5b2 → --color-variant-dark-200.
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  onChange,
  variant = "free",
  step = 10,
  minLabel,
  maxLabel,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const span = max - min || 1;

  const snap = (v: number) => {
    const clamped = clamp(v, min, max);
    if (variant !== "step" || step <= 0) return clamped;
    return clamp(min + Math.round((clamped - min) / step) * step, min, max);
  };

  const pct = ((clamp(value, min, max) - min) / span) * 100;

  /** Map a clientX to a snapped value using the track's own box. */
  const valueFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / (rect.width || 1), 0, 1);
    return snap(min + ratio * span);
  };

  const emit = (v: number) => {
    if (v !== value) onChange?.(v);
  };

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (disabled) return;
    // Capture on the track so the drag keeps tracking even past the knob edge.
    e.currentTarget.setPointerCapture(e.pointerId);
    // While dragging, the knob/fill must follow the pointer frame-for-frame —
    // the CSS `left`/`width` transition (great for keyboard/tap jumps) would
    // make them chase the pointer ~100ms behind. `.dragging` turns it off; it
    // comes back on release so a tap-to-jump still animates.
    setDragging(true);
    emit(valueFromClientX(e.clientX));
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    emit(valueFromClientX(e.clientX));
  };

  const endDrag = () => setDragging(false);

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (disabled) return;
    const stepBy = variant === "step" && step > 0 ? step : span / 100;
    let next = value;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + stepBy;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - stepBy;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    emit(snap(next));
  };

  // Step marks: min, min+step, … up to max (inclusive).
  const marks: number[] = [];
  if (variant === "step" && step > 0) {
    for (let v = min; v <= max + 1e-9; v += step) marks.push(clamp(v, min, max));
  }

  return (
    <div
      className={[styles.root, disabled && styles.disabled, className].filter(Boolean).join(" ")}
    >
      <div
        ref={trackRef}
        className={[styles.track, dragging && styles.dragging].filter(Boolean).join(" ")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="slider"
        aria-label={ariaLabel ?? "Slider"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamp(value, min, max)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />

        {marks.length > 0 && (
          <div className={styles.dots} aria-hidden="true">
            {marks.map((m) => (
              <span
                key={m}
                className={styles.dot}
                style={{ left: `${((m - min) / span) * 100}%` }}
              />
            ))}
          </div>
        )}

        <span className={styles.knob} style={{ left: `${pct}%` }} aria-hidden="true" />
      </div>

      {(minLabel != null || maxLabel != null) && (
        <div className={styles.labels}>
          <span className={styles.label}>{minLabel}</span>
          <span className={styles.label}>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default Slider;
