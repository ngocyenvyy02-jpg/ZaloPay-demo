import type { ReactNode } from "react";
import { useMountTransition } from "../../hooks/useMountTransition";
import styles from "./ScreenTransition.module.css";

export type TransitionKind = "push" | "present";

/** Duration (ms) each kind animates for — must match the motion tokens used
 *  in ScreenTransition.module.css (push = normal 300, present = slow 400). */
const DURATION: Record<TransitionKind, number> = {
  push: 300,
  present: 400,
};

export interface ScreenLayerProps {
  /** Whether this layer is active (mounted + entered). */
  active: boolean;
  /** Transition style: horizontal push or vertical present. */
  kind: TransitionKind;
  children: ReactNode;
}

/**
 * A single animated screen layer. Slides in when it becomes active and slides
 * out (staying mounted for the duration) when it becomes inactive.
 * Stack multiple layers in the router; the top one animates over the rest.
 */
export function ScreenLayer({ active, kind, children }: ScreenLayerProps) {
  const { shouldRender, stage } = useMountTransition(active, DURATION[kind]);

  if (!shouldRender) return null;

  return (
    <div className={[styles.layer, styles[kind], styles[stage]].join(" ")}>{children}</div>
  );
}

export interface ScreenStackProps {
  /**
   * The base (root) screen — the first, always-mounted layer. It receives the
   * iOS parallax recede while a push layer is on top.
   */
  base: ReactNode;
  /**
   * Whether a `push` layer is currently on top. Drives the base's parallax:
   * when true the base slides left ~30% (recedes) and eases back when false.
   * Wire this to the same `active` you pass the top `ScreenLayer`.
   */
  pushed: boolean;
  /** The stacked `ScreenLayer`(s) that animate over the base. */
  children: ReactNode;
}

/**
 * Stacks a base screen under one or more `ScreenLayer`s and adds the iOS-style
 * parallax: while a push layer is on top, the base recedes (slides left ~30%)
 * instead of sitting flat underneath, giving depth. Timing matches the push
 * layer's `--motion-duration-normal`, so base and incoming screen move together.
 *
 * Usage:
 *   <ScreenStack base={<Home/>} pushed={showDetail}>
 *     <ScreenLayer active={showDetail} kind="push"><Detail/></ScreenLayer>
 *   </ScreenStack>
 *
 * Parallax applies to `push` only (present is a vertical modal over a static
 * base — no recede). For a plain overlay with no base motion, keep using
 * `ScreenLayer` directly without a `ScreenStack`.
 */
export function ScreenStack({ base, pushed, children }: ScreenStackProps) {
  return (
    <>
      <div className={[styles.stackBase, pushed ? styles.stackBasePushed : ""].join(" ")}>
        {base}
      </div>
      {children}
    </>
  );
}

export default ScreenLayer;
