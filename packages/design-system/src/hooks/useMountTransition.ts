import { useEffect, useRef, useState } from "react";

export type TransitionStage = "pre-enter" | "enter" | "exit";

export interface MountTransition {
  /** Whether the element should be in the DOM (stays true during exit). */
  shouldRender: boolean;
  /** Current stage — drives the enter/exit CSS class. */
  stage: TransitionStage;
}

/**
 * Keep a component mounted for `duration`ms after it becomes inactive so its
 * exit animation can play before it unmounts. Motion itself is CSS-driven
 * (via motion tokens); this hook only orchestrates mount/unmount timing.
 */
export function useMountTransition(isActive: boolean, duration: number): MountTransition {
  const [shouldRender, setShouldRender] = useState(isActive);
  const [stage, setStage] = useState<TransitionStage>(isActive ? "enter" : "exit");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (isActive) {
      setShouldRender(true);
      // "pre-enter" is a static off-screen resting state — NOT the "exit"
      // animation class, which starts its keyframe from translateX(0)/
      // translateY(0) (on-screen) and would flash the layer fully visible
      // for this first frame before the enter animation ever runs.
      setStage("pre-enter");
      // Two rAFs: the first lets the browser paint the "pre-enter" (from)
      // state, the second flips to "enter" so the transition has a
      // committed starting frame to animate from — a single rAF can fire
      // before paint and collapse both class changes into one, skipping
      // the animation.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setStage("enter"));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    // becoming inactive: play exit, then unmount after duration
    setStage("exit");
    timer.current = setTimeout(() => setShouldRender(false), duration);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isActive, duration]);

  return { shouldRender, stage };
}

export default useMountTransition;
