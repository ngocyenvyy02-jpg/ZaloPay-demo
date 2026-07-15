/**
 * Semantic haptic vocabulary over the ZaloPay JS bridge (ported from
 * @zpi/z-taste `utils/haptic.ts`). Call sites say WHAT feedback they mean
 * (light / rigid / notification…), the iOS/Android parameter mapping lives in
 * exactly one place, and everything no-ops safely outside the ZaloPay webview
 * (optional-chained bridge + try/catch) — so prototypes run unchanged in a
 * plain browser. Wire these into e.g. `NumericKeyboard`'s `onHaptic` prop.
 */

export enum HapticType {
  NOTIFICATION = "notification",
  FEEDBACK = "feedback",
  SELECTION = "selection",
}
export enum HapticNotificationSubmode {
  SUCCESS = 0,
  WARNING = 1,
  ERROR = 2,
}
export enum HapticFeedbackSubmode {
  LIGHT = 0,
  MEDIUM = 1,
  HEAVY = 2,
  SOFT = 3,
  RIGID = 4,
}
export enum HapticAndroid {
  KEYBOARD_PRESS = 3,
  KEYBOARD_RELEASE = 7,
  LONG_PRESS = 0,
  NO_HAPTICS = -1,
  ERROR = 17,
}

interface HapticParams {
  type: HapticType;
  submode: HapticNotificationSubmode | HapticFeedbackSubmode;
  constant: HapticAndroid;
}

declare global {
  interface Window {
    ZaloPayJSBridge?: {
      call: (method: string, params: unknown, callback: () => void) => void;
    };
  }
}

const isIOS = () =>
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const playHaptic = ({ type, submode, constant }: HapticParams) => {
  try {
    const params = isIOS() ? { type, submode } : { constant };
    window.ZaloPayJSBridge?.call("playHapticV3", params, () => {});
  } catch {
    // Outside the ZaloPay webview — silently no-op.
  }
};

export const playHapticLight = () =>
  playHaptic({
    type: HapticType.FEEDBACK,
    submode: HapticFeedbackSubmode.LIGHT,
    constant: HapticAndroid.KEYBOARD_PRESS,
  });

export const playHapticRigid = () =>
  playHaptic({
    type: HapticType.FEEDBACK,
    submode: HapticFeedbackSubmode.RIGID,
    constant: HapticAndroid.KEYBOARD_PRESS,
  });

export const playHapticSoft = () =>
  playHaptic({
    type: HapticType.FEEDBACK,
    submode: HapticFeedbackSubmode.SOFT,
    constant: HapticAndroid.KEYBOARD_PRESS,
  });

export const playHapticHeavy = () =>
  playHaptic({
    type: HapticType.FEEDBACK,
    submode: HapticFeedbackSubmode.HEAVY,
    constant: HapticAndroid.KEYBOARD_PRESS,
  });

export const playHapticNotification = () =>
  playHaptic({
    type: HapticType.NOTIFICATION,
    submode: HapticNotificationSubmode.SUCCESS,
    constant: HapticAndroid.ERROR,
  });

export const playHapticSelection = () =>
  playHaptic({
    type: HapticType.SELECTION,
    submode: 0,
    constant: HapticAndroid.KEYBOARD_PRESS,
  });
