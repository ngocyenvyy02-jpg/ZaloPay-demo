import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { StatusBar, AppControl, useScreenParam } from "@zlp/design-system";
import { DevAgentation } from "./DevAgentation";
import { BankTransfer } from "./screens/BankTransfer";
import { TransferMoney } from "./screens/TransferMoney";
import { TransferSuccess } from "./screens/TransferSuccess";
import styles from "./App.module.css";
import "./index.css";

/**
 * Screen registry — one kebab-case id per built screen. Deep-link any screen
 * without clicking through the flow:
 *   dev:    http://localhost:5173/?screen=<id>
 *   vercel: https://<app>.vercel.app/?screen=<id>
 * new-screen.sh prints the registry line to add for each scaffolded screen.
 * NOTE: an id here is preview tooling, NOT navigation evidence (hard rule 4).
 */
const SCREENS: Record<string, ReactNode> = {
  "bank-transfer": <BankTransfer />,
  // Edge-case states (deep-link preview tooling — NOT in-app navigation).
  "bank-transfer-confirm": <BankTransfer initialOverlay="confirm" />,
  "bank-transfer-error-txn": <BankTransfer initialOverlay="error-txn" />,
  "bank-transfer-error-backend": <BankTransfer initialOverlay="error-backend" />,
  "bank-transfer-offline": <BankTransfer initialOverlay="offline" />,
  "bank-transfer-maintenance": <BankTransfer initialOverlay="maintenance" />,
  "transfer-money": <TransferMoney />,
  // Direct-preview of S3 only (deep-link tooling, not in-app navigation).
  "transfer-money-payoff": <TransferSuccess reward={30000} merchant="BHX" />,
};

/**
 * App shell.
 *
 * Renders the fixed OS-style chrome (StatusBar + AppControl chip) over an empty
 * screen frame. Build screens into `src/screens/` and render them inside
 * `.screen`; for screen transitions wrap them in <ScreenLayer> from
 * "@zlp/design-system". NavigationBar and Sheet are also in "@zlp/design-system".
 *
 * Screens are built here per project by /zlp-figma-to-code, reusing the shared
 * design system — never rebuild chrome/form controls locally.
 */
function App() {
  // Background behind the status bar. Screens can override this per-route.
  const statusBg = "var(--color-primary-white, #fff)";
  // ?screen=<id> deep-link override (null = run the normal flow below).
  const screenId = useScreenParam(Object.keys(SCREENS));

  return (
    <div className={styles.stack}>
      {/* Screen area — render your screen(s) here (default when no ?screen= param). */}
      <div className={styles.screen}>
        {screenId ? SCREENS[screenId] : <BankTransfer />}
      </div>

      {/* OS-style status bar: fixed on top while screens transition beneath. */}
      <div className={styles.statusBar} style={{ background: statusBg }}>
        <StatusBar />
      </div>

      {/* Mini-app control (••• | ✕): fixed top-right, same on every screen. */}
      <AppControl
        onMore={() => console.info("AppControl: more intent is not wired yet")}
        onClose={() => console.info("AppControl: close intent is not wired yet")}
      />

      {/*
        Tray / bottom-sheet — mount at THIS level (inside .stack) so the overlay
        covers the status bar + control. Mount ONLY when the design contains a
        sheet or the user asked for one (skill hard rule 4) — never as an
        invented destination for a tappable card/row. Drive `open` from screen
        state; put the sheet's own header/body/footer in children.
        `variant="bottomsheet"` for the full-width, flush-bottom kind.

        import { Sheet } from "@zlp/design-system";
        const [sheetOpen, setSheetOpen] = useState(false);

        <Sheet variant="tray" open={sheetOpen} onClose={() => setSheetOpen(false)}>
          ...sheet content...
        </Sheet>
      */}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* Agentation dev toolbar — desktop + localhost + dev only (see DevAgentation) */}
    <DevAgentation />
  </StrictMode>
);
