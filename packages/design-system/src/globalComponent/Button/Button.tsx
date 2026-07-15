import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "48" | "40" | "32" | "24";
export type ButtonVersion = "2.0" | "3.0";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Visual style. Default "primary". */
  variant?: ButtonVariant;
  /** Height tier: 48 / 40 / 32 / 24. Default "48". */
  size?: ButtonSize;
  /**
   * Design-system generation (two button versions coexist):
   * - "2.0" (default): rectangular radius per size; secondary = white bg + blue border.
   * - "3.0": pill radius at every size; secondary = blue-25 bg, no border, blue text.
   */
  version?: ButtonVersion;
  /** Optional leading icon (24px). */
  iconLeft?: ReactNode;
  /** Optional trailing icon (24px). */
  iconRight?: ReactNode;
  /** Stretch to fill the container width (default: hug content). */
  fullWidth?: boolean;
  /** Button label. */
  children: ReactNode;
  /** Native button type. Default "button". */
  type?: "button" | "submit" | "reset";
}

/**
 * Zalopay button (Design System 2.0, node 666:7586).
 * variant: primary (blue fill, white text) | secondary (white, blue border+text).
 * size: 48 / 40 / 32 / 24 (each with its own height/padding/radius/font/icon).
 * States: default, pressed (:active — scale 0.99, smooth), disabled.
 * Bold text, optional icons (24px at size 48, 16px otherwise).
 * Modelled with composed props rather than Figma's per-state variants.
 */
export function Button({
  variant = "primary",
  size = "48",
  version = "2.0",
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    styles.root,
    styles[variant],
    styles[`size${size}`],
    version === "3.0" && styles.v3,
    fullWidth && styles.fullWidth,
    className,
  ]
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

export default Button;
