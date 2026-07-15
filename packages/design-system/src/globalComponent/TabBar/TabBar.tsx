import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./TabBar.module.css";

export interface TabBarItemDef {
  /** Unique key for this tab (drives `value`/`onChange`). */
  key: string;
  /** Tab label under the icon. */
  label: ReactNode;
  /**
   * 24px icon. Tinted via `currentColor` — active is primary-blue, default is
   * primary-dark — so pass an icon whose paths use `fill="currentColor"`
   * (zlp-icons hardcode a hex; override `path { fill: currentColor }`).
   */
  icon: ReactNode;
}

export interface TabBarProps {
  /** The tabs, rendered left-to-right with equal widths. */
  items: TabBarItemDef[];
  /** Key of the active tab. Controlled — pair with `onChange`. */
  value: string;
  /** Fired when a tab is tapped. */
  onChange?: (key: string) => void;
  /** Extra class on the bar. */
  className?: string;
}

/**
 * Zalopay bottom TabBar (Figma "TabBar", node 51:5924). A row of equal-width
 * items, each a 24px icon + 12/16 label stacked. Active = primary-blue
 * icon/label; default = primary-dark. A 1px other-stroke2 baseline runs the
 * full width; a 2px primary-blue indicator SLIDES to the active tab (same
 * pattern as Tabs). White background. Controlled (value/onChange); icons are
 * supplied by the caller (Rule 3 — the component never bakes an icon). Tint
 * relies on `currentColor`.
 *
 * Tokens (all exact Figma matches): active #0033c9 → --color-primary-blue,
 * default label/icon #001f3e → --color-primary-dark, baseline #eef4fe
 * → --color-other-stroke2, background #fff → --color-primary-white.
 */
export function TabBar({ items, value, onChange, className }: TabBarProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<CSSProperties>({ opacity: 0 });

  const activeIndex = items.findIndex((it) => it.key === value);

  // Slide the 2px indicator to the active tab; re-measure on selection / set
  // change. useLayoutEffect (pre-paint) so the first render lands positioned,
  // not at 0 — same measure-before-paint pattern as Tabs.
  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) {
      setIndicator({ opacity: 0 });
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, [activeIndex, items]);

  return (
    <nav className={[styles.bar, className].filter(Boolean).join(" ")} role="tablist">
      {items.map((item, i) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            className={[styles.item, active && styles.active].filter(Boolean).join(" ")}
            onClick={() => onChange?.(item.key)}
          >
            <span className={styles.content}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </span>
          </button>
        );
      })}
      <span className={styles.indicator} style={indicator} aria-hidden="true" />
    </nav>
  );
}

export default TabBar;
