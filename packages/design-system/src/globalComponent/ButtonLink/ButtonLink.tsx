import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ButtonLink.module.css";

export type ButtonLinkSize = "16" | "14";

export interface ButtonLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /**
   * Size by font (Figma Large_16 / Small_14):
   * "16" = font 16/20, icon 24, gap 8 · "14" = font 14/18, icon 16, gap 4.
   * Default "16".
   */
  size?: ButtonLinkSize;
  /** Bold text (Figma "Text Bold"). Default false. */
  bold?: boolean;
  /** Optional leading icon (24px, tinted to the current text color). */
  iconLeft?: ReactNode;
  /** Optional trailing icon (24px, tinted to the current text color). */
  iconRight?: ReactNode;
  /** Button label. */
  children: ReactNode;
  /** Native button type. Default "button". */
  type?: "button" | "submit" | "reset";
}

/**
 * Zalopay link button (Design System 2.0, nodes 1620:12843 Large_16 /
 * 1620:13174 Small_14). A text-only action (no background/border/padding)
 * with optional icons (24px at size 16, 16px at size 14). States by text/icon
 * color: actived = primary-blue, pressed = blue-600 (color change only, NO
 * scale), disabled = dark-200. Icons use currentColor, so they follow the
 * state color automatically. Controlled via native button.
 */
export function ButtonLink({
  size = "16",
  bold = false,
  iconLeft,
  iconRight,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = [styles.root, styles[`size${size}`], bold && styles.bold, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} type={type} disabled={disabled} {...rest}>
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      <span className={styles.label}>{children}</span>
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
    </button>
  );
}

export default ButtonLink;
