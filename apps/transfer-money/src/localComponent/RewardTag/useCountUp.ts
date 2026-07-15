import { useEffect, useState } from "react";

/**
 * Tweens 0 → target over durationMs (ease-out cubic) while `active`. Resets to
 * 0 when inactive; snaps straight to target when `reducedMotion` is set.
 */
export function useCountUp(
  target: number,
  durationMs: number,
  active: boolean,
  reducedMotion: boolean,
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (reducedMotion || durationMs <= 0) {
      setValue(target);
      return;
    }

    setValue(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs, reducedMotion]);

  return value;
}
