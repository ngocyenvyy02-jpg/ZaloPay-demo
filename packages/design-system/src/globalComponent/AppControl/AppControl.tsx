import { DotsIcon, CloseIcon } from "../NavigationBar/icons";
import styles from "./AppControl.module.css";

export interface AppControlProps {
  /** ••• (more / support) handler. */
  onMore?: () => void;
  /** ✕ (close) handler. */
  onClose?: () => void;
  /** Light for dark backgrounds, dark for light backgrounds. */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Mini-app control chip (••• | ✕). Pinned to the top-right at the App level
 * so it stays fixed across every screen and during transitions — same idea
 * as the status bar. Screens must reserve room on the right of their nav
 * (see NavigationBar `--nav-control-inset`) so the title never runs under it.
 */
export function AppControl({ onMore, onClose, variant = "dark", className }: AppControlProps) {
  return (
    <div className={[styles.root, variant === "light" ? styles.light : styles.dark, className].filter(Boolean).join(" ")}>
      <div className={styles.chip}>
        <button type="button" className={styles.button} onClick={onMore} aria-label="Tùy chọn">
          <DotsIcon />
        </button>
        <span className={styles.divider} aria-hidden="true" />
        <button type="button" className={styles.button} onClick={onClose} aria-label="Đóng">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

export default AppControl;
