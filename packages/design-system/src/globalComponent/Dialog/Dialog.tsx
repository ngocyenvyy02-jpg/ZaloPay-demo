import { type ReactNode } from "react";
import { useMountTransition } from "../../hooks/useMountTransition";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import CloseIcon from "./close.svg?react";
import styles from "./Dialog.module.css";

// Matches --motion-duration-normal (overlay/content transition).
const DIALOG_DURATION = 300;

export interface DialogProps {
  /** Whether the dialog is open. Drives the enter/exit animation + mount. */
  open: boolean;
  /** Called on overlay tap (when closeOnOverlay) or the close button. */
  onClose?: () => void;
  /** Dialog content (illustration/title/message/actions live in children). */
  children: ReactNode;
  /** Show the top-right close (✕). Default true. */
  showClose?: boolean;
  /** Dismiss when the dimmed overlay is tapped. Default true. */
  closeOnOverlay?: boolean;
  /** Extra class on the dialog card. */
  className?: string;
}

/**
 * Centered modal dialog — overlay + a card that fades/scales in.
 *
 * Sibling to `Sheet` (bottom-anchored) for the cases the Zalopay design centers:
 * edge-case/error/status popups. Reuses the same overlay token
 * (`other-overlay`) above all app chrome, `useMountTransition` for the
 * mount-through-exit, and body scroll lock while open. The card is a shell;
 * put the illustration/title/message/buttons in `children`.
 *
 * Mounts wherever the screen renders; its overlay is z-index 2000 so it covers
 * the status bar + control, matching `Sheet`.
 */
export function Dialog({
  open,
  onClose,
  children,
  showClose = true,
  closeOnOverlay = true,
  className,
}: DialogProps) {
  const { shouldRender, stage } = useMountTransition(open, DIALOG_DURATION);
  useBodyScrollLock(open);

  if (!shouldRender) return null;

  return (
    <div className={`${styles.root} ${styles[stage]}`}>
      <div
        className={styles.overlay}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={[styles.card, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {showClose && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Đóng"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export default Dialog;
