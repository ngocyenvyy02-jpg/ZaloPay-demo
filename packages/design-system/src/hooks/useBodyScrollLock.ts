import { useEffect } from "react";

/**
 * Lock body scroll while `enabled` is true (overlay/sheet open). Restores the
 * previous overflow on cleanup. Ported from @zpi/z-taste `useBodyScrollLock`.
 */
export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [enabled]);
}
