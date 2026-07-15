import { useEffect, type RefObject } from "react";

/**
 * Scroll an input into view (centered, smooth) shortly after it gains focus —
 * the 300ms delay lets the OS keyboard finish appearing first. Ported from
 * @zpi/z-taste `useAutoScrollInput`.
 */
export function useAutoScrollInput(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    const handleFocus = () => {
      timer = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    el.addEventListener("focus", handleFocus);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("focus", handleFocus);
    };
  }, [ref]);
}
