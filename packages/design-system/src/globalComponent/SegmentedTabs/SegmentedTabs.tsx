import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./SegmentedTabs.module.css";

export interface SegmentedItemDef {
  /** Unique key for this segment (drives `value`/`onChange`). */
  key: string;
  /** Segment label. Truncates to a single line when it overflows. */
  label: ReactNode;
}

export interface SegmentedTabsProps {
  /** The segments. Always equal-width (flex:1); supports 2, 3+ segments. */
  items: SegmentedItemDef[];
  /** Key of the active segment. Controlled — pair with `onChange`. */
  value: string;
  /** Fired when a segment is tapped. */
  onChange?: (key: string) => void;
  /** Extra class on the container (custom colors OK; keep size/spacing). */
  className?: string;
}

/**
 * Zalopay segmented tabs (Design System — node 34:2184 "Tabs" segmented
 * variant). A pill track (radius 100, 3px padding, bg `other-background`)
 * holding equal-width segments; the active segment is a WHITE pill that
 * SLIDES between positions. Active label = primary-blue, inactive = dark-300,
 * bold 14/18. Distinct from the underline `Tabs` — this is the pill/segmented
 * control. Labels truncate to one line on overflow.
 */
export function SegmentedTabs({ items, value, onChange, className }: SegmentedTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<CSSProperties>({ opacity: 0 });

  const activeIndex = items.findIndex((it) => it.key === value);

  // Position the sliding white pill under the active segment; re-measure when
  // the selection or the segment set changes.
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) {
      setThumb({ opacity: 0 });
      return;
    }
    setThumb({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [activeIndex, items]);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      ref={trackRef}
      role="tablist"
    >
      <span className={styles.thumb} style={thumb} aria-hidden="true" />
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
          <span className={styles.label}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

export default SegmentedTabs;
