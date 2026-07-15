/* @zlp/design-system — barrel. Import shared components/hooks from here:
     import { Radio, Checkbox, Sheet } from "@zlp/design-system";
   For a direct component path (tree-shaking / importing icons.tsx), the package
   also exposes "@zlp/design-system/globalComponent/<Name>" via the "./*" export.
   Tokens are a separate CSS import: import "@zlp/design-system/tokens.css". */

// App chrome
export { StatusBar } from "./globalComponent/StatusBar";
export type { StatusBarProps } from "./globalComponent/StatusBar";
export { AppControl } from "./globalComponent/AppControl";
export type { AppControlProps } from "./globalComponent/AppControl";
export { NavigationBar } from "./globalComponent/NavigationBar";
export type { NavigationBarProps } from "./globalComponent/NavigationBar";
export { ScreenLayer, ScreenStack } from "./globalComponent/ScreenTransition";
export type { ScreenLayerProps, ScreenStackProps, TransitionKind } from "./globalComponent/ScreenTransition";
export { Sheet } from "./globalComponent/Sheet";
export type { SheetProps, SheetVariant } from "./globalComponent/Sheet";
export { Dialog } from "./globalComponent/Dialog";
export type { DialogProps } from "./globalComponent/Dialog";

// Actions
export { Button } from "./globalComponent/Button";
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonVersion } from "./globalComponent/Button";
export { ButtonLink } from "./globalComponent/ButtonLink";
export type { ButtonLinkProps, ButtonLinkSize } from "./globalComponent/ButtonLink";

// Navigation
export { Tabs } from "./globalComponent/Tabs";
export type { TabsProps, TabItemDef } from "./globalComponent/Tabs";
export { SegmentedTabs } from "./globalComponent/SegmentedTabs";
export type { SegmentedTabsProps, SegmentedItemDef } from "./globalComponent/SegmentedTabs";
export { TabBar } from "./globalComponent/TabBar";
export type { TabBarProps, TabBarItemDef } from "./globalComponent/TabBar";

// Data display
export { Label } from "./globalComponent/Label";
export type { LabelProps, LabelVariant } from "./globalComponent/Label";
export { Ribbon } from "./globalComponent/Ribbon";
export type { RibbonProps, RibbonType, RibbonColor } from "./globalComponent/Ribbon";
export { NumberBadge } from "./globalComponent/NumberBadge";
export type { NumberBadgeProps } from "./globalComponent/NumberBadge";

// Form controls
export { Chip, ChipChevron } from "./globalComponent/Chip";
export type { ChipProps, ChipVariant, ChipSize } from "./globalComponent/Chip";
export { Input } from "./globalComponent/Input";
export type { InputProps, InputSize } from "./globalComponent/Input";
export { Radio } from "./globalComponent/Radio";
export type { RadioProps } from "./globalComponent/Radio";
export { Checkbox } from "./globalComponent/Checkbox";
export type { CheckboxProps } from "./globalComponent/Checkbox";
export { Toggle } from "./globalComponent/Toggle";
export type { ToggleProps, ToggleSize } from "./globalComponent/Toggle";
export { Slider } from "./globalComponent/Slider";
export type { SliderProps, SliderVariant } from "./globalComponent/Slider";

// Overlays
export { Tooltip } from "./globalComponent/Tooltip";
export type { TooltipProps, TooltipSide, TooltipAlign } from "./globalComponent/Tooltip";

// Feedback / motion (ported from @zpi/z-taste)
export { LoadingDots } from "./globalComponent/LoadingDots";
export type { LoadingDotsProps } from "./globalComponent/LoadingDots";
export { NumericKeyboard } from "./globalComponent/NumericKeyboard";
export type { NumericKeyboardProps, NumericKeyboardSize } from "./globalComponent/NumericKeyboard";
export { AutoHeight } from "./globalComponent/AutoHeight";
export type { AutoHeightProps } from "./globalComponent/AutoHeight";
export { AmountDisplay } from "./globalComponent/AmountDisplay";
export type { AmountDisplayProps, AmountTextAlign } from "./globalComponent/AmountDisplay";

// Hooks
export { useMountTransition } from "./hooks/useMountTransition";
export type { MountTransition, TransitionStage } from "./hooks/useMountTransition";
export { useBodyScrollLock } from "./hooks/useBodyScrollLock";
export { useKeyboard } from "./hooks/useKeyboard";
export type { KeyboardState } from "./hooks/useKeyboard";
export { useAutoScrollInput } from "./hooks/useAutoScrollInput";
export { useScreenParam } from "./hooks/useScreenParam";

// Utils
export {
  playHaptic,
  playHapticLight,
  playHapticRigid,
  playHapticSoft,
  playHapticHeavy,
  playHapticNotification,
  playHapticSelection,
  HapticType,
  HapticFeedbackSubmode,
  HapticNotificationSubmode,
  HapticAndroid,
} from "./utils/haptic";
