/**
 * Shared deep-link convention for prototype apps: `?screen=<id>`.
 *
 * Each app's shell (main.tsx) declares a SCREENS registry — one kebab-case id
 * per built screen — and renders the matching screen directly when the URL
 * carries `?screen=<id>`. Without the param the app runs its normal flow.
 *
 *   const SCREENS: Record<string, ReactNode> = {
 *     "home": <Home />,
 *     "term-life-intro": <TermLifeIntro />,
 *   };
 *   const screenId = useScreenParam(Object.keys(SCREENS));
 *   ...
 *   <div className={styles.screen}>
 *     {screenId ? SCREENS[screenId] : <Home />}
 *   </div>
 *
 * Why: opening a specific screen without clicking through the flow — fast dev
 * preview (`localhost:5173/?screen=detail`), Vercel share links that land a
 * reviewer on the exact screen (`https://<app>.vercel.app/?screen=detail`),
 * and Agentation debugging on a deep screen. Query param (not a path) so it
 * works on static Vercel hosting with zero rewrite config.
 *
 * This is DEV/PREVIEW tooling, not navigation: registering an id is NOT
 * evidence for wiring an in-app flow (skill hard rule 4 still governs what
 * navigates where inside the UI).
 */
export function useScreenParam(validIds?: readonly string[]): string | null {
  if (typeof window === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("screen");
  if (!id) return null;
  if (validIds && !validIds.includes(id)) {
    console.warn(
      `[useScreenParam] unknown screen id "${id}" — registered: ${validIds.join(", ") || "(none)"}`
    );
    return null;
  }
  return id;
}
