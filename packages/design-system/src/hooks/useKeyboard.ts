import { useEffect, useState } from "react";

export interface KeyboardState {
  /** Current visual-viewport height (falls back to window.innerHeight). */
  bodyHeight: number;
  /** True while the OS virtual keyboard is (likely) shown. */
  isKeyboardVisible: boolean;
  /** Estimated keyboard height in px (0 when hidden). */
  keyboardHeight: number;
}

/**
 * Detect the OS virtual keyboard via `window.visualViewport` resize: when the
 * visual viewport shrinks below the window height, the difference is treated
 * as the keyboard. Ported from @zpi/z-taste `useKeyboard`.
 */
export function useKeyboard(): KeyboardState {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerHeight
  );

  useEffect(() => {
    const handleVisualViewportResize = () => {
      const viewportHeight = window.visualViewport?.height || 0;
      const isVisible = viewportHeight < window.innerHeight;

      if (isVisible) {
        setKeyboardHeight(Math.max(window.innerHeight - viewportHeight, 0));
        setKeyboardVisible(true);
      } else {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
      setBodyHeight(viewportHeight);
    };

    window.visualViewport?.addEventListener("resize", handleVisualViewportResize);
    handleVisualViewportResize(); // initialize on mount

    return () => {
      window.visualViewport?.removeEventListener("resize", handleVisualViewportResize);
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      // Window resize (rotation, split view) — reset keyboard state.
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      setBodyHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { bodyHeight, isKeyboardVisible, keyboardHeight };
}
