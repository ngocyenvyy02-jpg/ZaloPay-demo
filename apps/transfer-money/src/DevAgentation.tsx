import { useEffect, useState } from "react";
import { Agentation } from "agentation";

/** Matches the app's desktop-frame breakpoint in index.css. */
const DESKTOP_QUERY = "(min-width: 768px)";

const isLocalhost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

/**
 * Dev-only gate for the Agentation annotation toolbar. Renders only when ALL
 * three hold:
 *  - dev build (`import.meta.env.DEV`) — production/Vercel never ships it
 *    (statically eliminated at build time);
 *  - localhost — opening the dev server from a phone over LAN/tunnel stays
 *    clean;
 *  - desktop viewport (≥768px, live via matchMedia) — the tool is
 *    desktop-only and would cover a mobile view.
 */
export function DevAgentation() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!import.meta.env.DEV || !isLocalhost || !desktop) return null;
  return <Agentation />;
}

export default DevAgentation;
