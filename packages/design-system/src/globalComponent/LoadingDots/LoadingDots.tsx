import styles from "./LoadingDots.module.css";

export interface LoadingDotsProps {
  /** Extra class on the container (set `color` to tint the dots). */
  className?: string;
}

/**
 * Three-dot "typing" loading indicator. Ported from @zpi/z-taste
 * `LoadingDots` (box-shadow keyframe trick, 1.5s linear loop). Dots render in
 * `currentColor` — set CSS `color` on the container to tint (the z-taste
 * original hardcoded white for use inside primary buttons).
 */
export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <span className={[styles.root, className].filter(Boolean).join(" ")} role="status" aria-label="Đang xử lý">
      <span className={styles.dot} aria-hidden="true" />
    </span>
  );
}

export default LoadingDots;
