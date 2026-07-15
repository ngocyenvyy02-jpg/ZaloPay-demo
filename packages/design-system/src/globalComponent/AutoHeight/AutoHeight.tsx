import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./AutoHeight.module.css";

export interface AutoHeightProps {
  /**
   * Identity of the current content. When it changes the new content fades in
   * and the container animates to the new height.
   */
  viewKey: string;
  children: ReactNode;
  /**
   * Animate height/opacity changes (default true). Pass false to snap
   * instantly — e.g. `!isKeyboardVisible` from `useKeyboard`, which is exactly
   * what the z-taste original did internally to avoid fighting the OS
   * keyboard resize.
   */
  animate?: boolean;
  /** Fade the swapped view in while height animates (default true). */
  fadeView?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Container that smoothly animates its height to fit changing content
 * (ResizeObserver-measured), with a fade-in when `viewKey` swaps views.
 * Ported from @zpi/z-taste `MotionElement`, rewritten from framer-motion
 * (AnimatePresence) to pure CSS transitions per DS convention. Difference vs
 * the original: outgoing content is not exit-animated — the new view fades in
 * over the measured height change.
 */
export function AutoHeight({
  viewKey,
  children,
  animate = true,
  fadeView = true,
  className,
  style,
}: AutoHeightProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  // Re-observe on every viewKey swap: the keyed view div (and the content div
  // inside it) REMOUNTS when viewKey changes, so an observer created once with
  // [] deps would keep watching the detached old node — it fires a final 0×0
  // (collapsing the container to 0) and the new content is never measured.
  //
  // useLayoutEffect (NOT useEffect): the new view must be measured and its
  // height committed to the container BEFORE the browser paints. With useEffect
  // (post-paint) the swapped-in view is painted for one frame inside the
  // container still sized to the OLD view — the content overflows/clips for a
  // frame and then snaps to the right height: the visible "flash" on step
  // change. Matches how Tabs/SegmentedTabs measure DOM here.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    setHeight(el.getBoundingClientRect().height); // measure the new view immediately
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [viewKey]);

  return (
    <div
      className={[styles.root, animate && styles.animated, className].filter(Boolean).join(" ")}
      style={{ ...style, height: height === "auto" ? "auto" : `${height}px` }}
    >
      <div key={viewKey} className={animate && fadeView ? styles.view : undefined}>
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}

export default AutoHeight;
