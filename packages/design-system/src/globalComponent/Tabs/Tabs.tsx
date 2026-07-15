import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabItemDef {
  /** Unique key for this tab (drives `value`/`onChange`). */
  key: string;
  /** Tab label. Per the DS guides: ~7 chars max at 4 tabs, ~10 at 3, ~18 at 2. */
  label: ReactNode;
  /** Optional 24px icon before the label (tinted via currentColor). */
  icon?: ReactNode;
}

export interface TabsProps {
  /** The tabs. Fixed layout up to 4; more than 4 always renders scrollable. */
  items: TabItemDef[];
  /** Key of the active tab. Controlled — pair with `onChange`. */
  value: string;
  /** Fired when a tab is tapped. */
  onChange?: (key: string) => void;
  /**
   * Force scrollable (hug-width tabs, horizontal scroll). Default: automatic —
   * fixed (equal widths, full container) for ≤4 items, scrollable for >4,
   * per the DS guides.
   */
  scrollable?: boolean;
  /** Extra class on the container (custom colors OK; keep size/spacing). */
  className?: string;
}

/**
 * Zalopay tabs (Design System 2.0 — nodes 617:7445 tab_item / 9518:126489
 * Tabs). Item: height 48, content px16 py8 gap8, optional 24px icon, bold
 * 14/18 label; active = primary-blue, inactive = dark-300; pressed = dark-25
 * tint. A 1px dark-50 baseline runs the full width; the 2px blue indicator
 * SLIDES to the active tab (animated, per the guides). Fixed = equal-width
 * tabs filling the container (max 4); >4 = scrollable hug-width tabs.
 * No badges inside tabs (guides).
 */
export function Tabs({ items, value, onChange, scrollable, className }: TabsProps) {
  const isScrollable = scrollable ?? items.length > 4;
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<CSSProperties>({ opacity: 0 });

  const activeIndex = items.findIndex((it) => it.key === value);

  // Position the sliding indicator under the active tab; re-measure when the
  // selection or the tab set changes.
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) {
      setIndicator({ opacity: 0 });
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    // Keep the active tab in view when scrollable.
    if (isScrollable) {
      el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  }, [activeIndex, items, isScrollable]);

  return (
    <div
      className={[styles.root, isScrollable && styles.scrollable, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.track} ref={trackRef}>
        {items.map((it, i) => (
          <button
            key={it.key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            className={[styles.item, it.key === value && styles.active]
              .filter(Boolean)
              .join(" ")}
            aria-selected={it.key === value}
            role="tab"
            onClick={() => onChange?.(it.key)}
          >
            {it.icon && <span className={styles.icon}>{it.icon}</span>}
            <span className={styles.label}>{it.label}</span>
          </button>
        ))}
        <span className={styles.indicator} style={indicator} aria-hidden="true" />
      </div>
    </div>
  );
}

export default Tabs;
