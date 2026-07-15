import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Tooltip.module.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** Tooltip bubble content (the `I'm tooltip` text, or any node). */
  content: ReactNode;
  /** Which side of the target the bubble sits on. Default "top". */
  side?: TooltipSide;
  /**
   * Alignment along that side. For top/bottom: start=left, end=right. For
   * left/right: start=top, end=bottom. Default "center".
   */
  align?: TooltipAlign;
  /** Optional leading icon (16px) inside the bubble. */
  icon?: ReactNode;
  /** The target element the tooltip is anchored to and triggered by. */
  children: ReactNode;
  /** Force the tooltip open (uncontrolled hover/focus is the default). */
  open?: boolean;
  /** Extra class on the wrapper. */
  className?: string;
}

/**
 * Zalopay tooltip (Design System 3.0, node 89786:16581). A blue bubble with a
 * 12×8 arrow that points at the target it wraps. Mobile-first: **tap the target
 * to toggle** the tooltip; tap elsewhere to dismiss (no hover — this is a touch
 * UI). Force-open with `open`. Positioned with pure CSS around a relatively-
 * positioned wrapper — no external positioning lib. The 10 Figma arrow variants
 * map to `side` (top/bottom/left/right) × `align` (start/center/end).
 */
export function Tooltip({
  content,
  side = "top",
  align = "center",
  icon,
  children,
  open,
  className,
}: TooltipProps) {
  const [tappedOpen, setTappedOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const controlled = open !== undefined;
  const visible = controlled ? open : tappedOpen;

  // Tap outside to dismiss (only while open and uncontrolled).
  useEffect(() => {
    if (controlled || !tappedOpen) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setTappedOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [controlled, tappedOpen]);

  return (
    <span
      ref={wrapperRef}
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
      onClick={() => {
        if (!controlled) setTappedOpen((v) => !v);
      }}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={[styles.tip, styles[`side_${side}`], styles[`align_${align}`]]
            .filter(Boolean)
            .join(" ")}
        >
          <span className={styles.arrow} aria-hidden="true" />
          <span className={styles.bubble}>
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.text}>{content}</span>
          </span>
        </span>
      )}
    </span>
  );
}

export default Tooltip;
