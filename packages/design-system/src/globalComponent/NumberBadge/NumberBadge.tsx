import styles from "./NumberBadge.module.css";

export interface NumberBadgeProps {
  /** The count to display. */
  count: number;
  /** Cap; counts above show as "{max}+". Default 99. */
  max?: number;
  /** Extra class. */
  className?: string;
}

/**
 * Zalopay notification count badge (Design System 2.0, node 14766:157789 —
 * Figma "numberic"). Red pill, height 16, bold 12/16 white text, centered.
 * 1 character renders as a 16×16 circle; wider counts hug (24 at 2 chars,
 * "99+" at the cap).
 */
export function NumberBadge({ count, max = 99, className }: NumberBadgeProps) {
  const text = count > max ? `${max}+` : `${count}`;
  return (
    <span className={[styles.root, className].filter(Boolean).join(" ")}>
      {text}
    </span>
  );
}

export default NumberBadge;
