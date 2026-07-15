import { useEffect, useRef, useState } from "react";
import { BackIcon } from "./icons";
import styles from "./NavigationBar.module.css";

export interface NavigationBarProps {
  /** Title text shown next to the back button. */
  title?: string;
  /** Center the title instead of left-aligning. Default: left (matches Figma). */
  centerTitle?: boolean;
  /** Show the back arrow. Default: true. */
  showBack?: boolean;
  /** Back arrow handler. */
  onBack?: () => void;
  /**
   * Background color revealed as the screen scrolls (iOS-style fade). When set,
   * the nav is transparent at the top (so a hero/gradient shows through) and
   * fades to this color once the scroll container passes `fadeThreshold`px.
   * Omit for a nav whose background is fixed (e.g. a solid blue nav): no fade.
   *
   * NOTE: fade is meant for a nav WITH a title. A title-less nav skips the fade
   * even if a color is passed here, unless you also set `forceFade`. Pass a CSS
   * color or a `var(--token)`.
   */
  fadeBg?: string;
  /** Force the scroll fade even when there is no title (rarely needed). */
  forceFade?: boolean;
  /** Scroll distance (px) before the fade completes. Default 8. */
  fadeThreshold?: number;
  className?: string;
}

/**
 * Walk up from `el` to the nearest ancestor whose `overflow-y` makes it a
 * scroll container, or null. Resolved by style ALONE — NOT by whether it is
 * currently tall enough to scroll, so the listener still attaches when content
 * (async images/data) grows scrollable only after mount.
 */
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Top navigation bar. Figma: node 1:1893 ("Navigation Bar").
 *
 * ALWAYS sticky — pins to the top of its scroll container (the screen's own
 * scroll area), so it never scrolls away with the content. The mini-app control
 * chip (••• | ✕) is NOT part of this component — it lives at the App level (see
 * AppControl). The nav reserves room on the right (--nav-control-inset) so the
 * title always keeps a 16px gap from that fixed control.
 *
 * Background:
 *  - Fixed nav (solid color): set `--navigation-bar-bg` (via `className`) and
 *    omit `fadeBg`. No scroll fade — the color always shows.
 *  - Fading nav (transparent over a hero): pass `fadeBg`. Transparent at the top,
 *    fades to `fadeBg` once scrolled. Only fades when there is a `title` (or
 *    `forceFade`), matching the design convention that title-less navs don't fade.
 */
export function NavigationBar({
  title,
  centerTitle = false,
  showBack = true,
  onBack,
  fadeBg,
  forceFade = false,
  fadeThreshold = 8,
  className,
}: NavigationBarProps) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // A nav fades only when it has a fade color AND (a title or an explicit
  // forceFade) — a title-less nav skips the fade unless forced.
  const fadeEnabled = fadeBg !== undefined && (Boolean(title) || forceFade);

  useEffect(() => {
    if (!fadeEnabled) return;
    const scroller = findScrollParent(ref.current);
    if (!scroller) return;

    const onScroll = () => setScrolled(scroller.scrollTop > fadeThreshold);
    onScroll(); // sync initial state (e.g. restored scroll position)
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [fadeEnabled, fadeThreshold]);

  // When fading: transparent until scrolled, then fadeBg. Otherwise the CSS
  // default (`--navigation-bar-bg`) owns the background.
  const style =
    fadeEnabled
      ? ({ background: scrolled ? fadeBg : "transparent" } as React.CSSProperties)
      : undefined;

  return (
    <nav
      ref={ref}
      className={[styles.navbar, className].filter(Boolean).join(" ")}
      style={style}
      data-node-id="1:1893"
    >
      <div className={styles.container}>
        <div className={styles.leading}>
          {showBack && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={onBack}
              aria-label="Quay lại"
            >
              <BackIcon />
            </button>
          )}
          {title !== undefined && (
            <span className={[styles.title, centerTitle ? styles.centered : ""].join(" ")}>
              {title}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
