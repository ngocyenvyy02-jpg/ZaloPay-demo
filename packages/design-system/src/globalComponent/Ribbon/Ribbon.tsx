import type { ReactNode } from "react";
import Fold from "./fold.svg?react";
import GiftStarSecondary from "./gift-star-secondary.svg?react";
import GiftStarPrimary from "./gift-star-primary.svg?react";
import GiftGlyphSecondary from "./gift-glyph-secondary.svg?react";
import GiftGlyphPrimary from "./gift-glyph-primary.svg?react";
import styles from "./Ribbon.module.css";

export type RibbonType = "1" | "2" | "gift";
export type RibbonColor = "green" | "red" | "grey";

export interface RibbonProps {
  /**
   * Figma "Types": "1" = small corner tag (h16), "2" = floating tag with a
   * fold (h18 + 2px dog-ear), "gift" = 24px star badge (red only, no text).
   */
  type?: RibbonType;
  /** Semantic color. Default "red". (gift exists in red only.) */
  color?: RibbonColor;
  /** Secondary look (type 1 & gift): tinted instead of solid. */
  secondary?: boolean;
  /** Ribbon text (types 1 & 2; ignored for gift). */
  children?: ReactNode;
  /** Extra class. */
  className?: string;
}

/**
 * Zalopay ribbon (Design System 2.0, node 14551:163217).
 * Type 1: h16, px4, radius 6 except sharp bottom-left, bold 10/12 text.
 *   Primary = solid + white border/text; secondary = *-25 bg + *-100/400
 *   border + shade text.
 * Type 2: floating tag h18, px6, radius 4 except sharp bottom-right, card
 *   shadow, white bold 12/16 text + a 2px curved fold (shade *-700) under the
 *   right edge. Solid colors only (per Figma).
 * Gift: 24px star badge with gift glyph — real Figma vectors, red only,
 *   secondary (tinted) or primary (solid, small shadow).
 */
export function Ribbon({
  type = "1",
  color = "red",
  secondary = false,
  children,
  className,
}: RibbonProps) {
  if (type === "gift") {
    const Star = secondary ? GiftStarSecondary : GiftStarPrimary;
    const Glyph = secondary ? GiftGlyphSecondary : GiftGlyphPrimary;
    return (
      <span
        className={[styles.gift, !secondary && styles.giftPrimary, className]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <Star className={styles.giftStar} />
        <Glyph className={styles.giftGlyph} />
      </span>
    );
  }

  if (type === "2") {
    return (
      <span className={[styles.type2, styles[color], className].filter(Boolean).join(" ")}>
        <span className={styles.type2Tag}>{children}</span>
        <Fold className={styles.fold} />
      </span>
    );
  }

  return (
    <span
      className={[styles.type1, styles[color], secondary && styles.secondary, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

export default Ribbon;
