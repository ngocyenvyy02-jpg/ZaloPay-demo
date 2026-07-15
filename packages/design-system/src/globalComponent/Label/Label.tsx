import type { ReactNode } from "react";
import styles from "./Label.module.css";

export type LabelVariant = "positive" | "warning" | "negative" | "neutral";

export interface LabelProps {
  /** Semantic color (Figma "States"). Default "neutral". */
  variant?: LabelVariant;
  /** Secondary look: tinted background + dark shade text (vs solid + white). */
  secondary?: boolean;
  /** Bold text (Figma "Text Bold"). Default true. */
  bold?: boolean;
  /** Label text. */
  children: ReactNode;
  /** Extra class. */
  className?: string;
}

/**
 * Zalopay status label / tag chip (Design System 2.0, node 14551:163203).
 * px 8 / py 2, radius 4, text 12/16 (bold by default). Primary = solid
 * semantic color + white text; secondary = *-50 tint + *-700 shade text
 * (neutral: dark-50 / dark-400).
 */
export function Label({
  variant = "neutral",
  secondary = false,
  bold = true,
  children,
  className,
}: LabelProps) {
  const cls = [
    styles.root,
    styles[variant],
    secondary && styles.secondary,
    bold && styles.bold,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}

export default Label;
