import { type ReactNode } from "react";
import styles from "./StatusContent.module.css";

export interface StatusContentProps {
  /** 120×120 illustration source (edge-case art). Optional → placeholder box. */
  illustration?: string;
  title: string;
  message: string;
  /** Optional actions (DS Button[s]) rendered under the message. */
  children?: ReactNode;
  className?: string;
}

/**
 * Edge-case status block: 120px illustration + title + message + optional
 * action(s). Shared by the error/maintenance/offline states (inside a Dialog,
 * or full-screen for maintenance) so the copy layout stays identical.
 */
export function StatusContent({
  illustration,
  title,
  message,
  children,
  className,
}: StatusContentProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {illustration ? (
        <img className={styles.illustration} src={illustration} alt="" />
      ) : (
        // TODO: asset chưa export — illustration edge-case (barrier / no-internet)
        <div className={styles.illustrationPlaceholder} aria-hidden="true" />
      )}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>
      {children}
    </div>
  );
}

export default StatusContent;
