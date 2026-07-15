import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useMountTransition } from "../../hooks/useMountTransition";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import styles from "./Sheet.module.css";

// Matches --motion-duration-slow (drawer / screen push).
const SHEET_DURATION = 400;
// Drag-to-dismiss thresholds: past this offset OR flicked faster than this.
const DISMISS_OFFSET_PX = 96;
const DISMISS_VELOCITY = 0.6; // px/ms
const DRAG_START_PX = 8; // dead zone before a touch counts as a drag

export type SheetVariant = "tray" | "bottomsheet";

export interface SheetProps {
  /** Whether the sheet is open. Drives the enter/exit animation + mount. */
  open: boolean;
  /**
   * Zalopay sheet kinds:
   * - "tray": 16px side insets, 32px from bottom, rounded on all corners.
   * - "bottomsheet": full width, flush to the bottom, rounded top corners only.
   * Both slide up from below and cap their height so they never cover the nav.
   */
  variant?: SheetVariant;
  /** Called when the overlay is clicked or the sheet is dragged down (dismiss). */
  onClose?: () => void;
  /** Sheet content (build your header/body/footer inside). */
  children: ReactNode;
  /** Extra class on the sheet surface. */
  className?: string;
  /**
   * Drag the sheet downward to dismiss (default true). Drags never start from
   * content that is itself scrolled; a small dead zone keeps taps intact.
   */
  dragToClose?: boolean;
  /**
   * Non-modal mode (z-taste keyboard-tray style): no overlay, the background
   * stays interactive, body scroll is not locked. Dismiss via drag or code.
   */
  nonModal?: boolean;
  /** Fixed height of the sheet surface (e.g. "60%", "420px"). */
  height?: string;
  /** Minimum height of the sheet surface. */
  minHeight?: string;
}

/**
 * Overlay + slide-up container for trays and bottom-sheets.
 *
 * Handles: dimmed overlay (token `other-overlay`) above ALL app chrome incl. the
 * status bar; drawer slide-up/out animation; keeping the element mounted through
 * its exit; a max-height so tall content scrolls inside instead of covering the
 * top nav; drag-down-to-dismiss (offset or flick velocity, ported behavior from
 * z-taste/vaul); body scroll lock while open. Put only the sheet's own content
 * in `children`.
 *
 * Mounts at the App level (inside `.stack`) so the overlay covers everything.
 */
export function Sheet({
  open,
  variant = "tray",
  onClose,
  children,
  className,
  dragToClose = true,
  nonModal = false,
  height,
  minHeight,
}: SheetProps) {
  const { shouldRender, stage } = useMountTransition(open, SHEET_DURATION);
  useBodyScrollLock(open && !nonModal);

  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    pointerId: number;
    startY: number;
    lastY: number;
    lastT: number;
    velocity: number;
    active: boolean;
  } | null>(null);

  // While a drag is active, block native touch scrolling (non-passive listener —
  // touch-action can't be flipped mid-gesture).
  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (drag.current?.active) e.preventDefault();
    };
    document.addEventListener("touchmove", preventTouchScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventTouchScroll);
  }, []);

  if (!shouldRender) return null;

  /** A drag may not start from content that is itself scrolled down. */
  const canStartDrag = (target: EventTarget | null) => {
    let el = target as HTMLElement | null;
    while (el && el !== sheetRef.current) {
      if (el.scrollHeight > el.clientHeight + 1 && el.scrollTop > 0) return false;
      el = el.parentElement;
    }
    return true;
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (!dragToClose || !onClose) return;
    if (!canStartDrag(e.target)) return;
    drag.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: e.timeStamp,
      velocity: 0,
      active: false,
    };
  };

  const handlePointerMove = (e: PointerEvent) => {
    const d = drag.current;
    const sheet = sheetRef.current;
    if (!d || !sheet) return;
    const dy = e.clientY - d.startY;

    if (!d.active) {
      if (dy <= DRAG_START_PX) return; // dead zone — taps & upward moves pass through
      d.active = true;
      sheet.setPointerCapture(d.pointerId);
      sheet.style.transition = "none";
    }

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;

    sheet.style.transform = `translateY(${Math.max(0, dy)}px)`;
  };

  const endDrag = (e: PointerEvent) => {
    const d = drag.current;
    const sheet = sheetRef.current;
    drag.current = null;
    if (!d?.active || !sheet) return;

    const dy = Math.max(0, e.clientY - d.startY);
    const dismissTransition = `transform ${SHEET_DURATION}ms var(--motion-ease-drawer, cubic-bezier(0.32, 0.72, 0, 1))`;

    if (dy > DISMISS_OFFSET_PX || d.velocity > DISMISS_VELOCITY) {
      // Slide the rest of the way from the current offset, then let
      // useMountTransition unmount after the exit window.
      sheet.style.transition = dismissTransition;
      sheet.style.transform = "translateY(120%)";
      onClose?.();
    } else {
      // Spring back to the class-driven resting position.
      sheet.style.transition = dismissTransition;
      sheet.style.transform = "";
    }
  };

  const surfaceStyle: CSSProperties | undefined =
    height || minHeight ? { height, minHeight } : undefined;

  return (
    <div className={`${styles.root} ${styles[variant]} ${styles[stage]} ${nonModal ? styles.nonModal : ""}`}>
      {!nonModal && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <div
        ref={sheetRef}
        className={[styles.sheet, className].filter(Boolean).join(" ")}
        style={surfaceStyle}
        role="dialog"
        aria-modal={!nonModal}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
    </div>
  );
}

export default Sheet;
