import type { BadgeSkin, OptionId, RevealState } from "./types";
import { RewardTagFlyToCta } from "./RewardTagFlyToCta";
import { RewardTagCountUp } from "./RewardTagCountUp";
import { RewardTagGiftBox } from "./RewardTagGiftBox";
import { RewardTagWipe } from "./RewardTagWipe";

export interface RewardTagProps {
  option: OptionId;
  state: RevealState;
  reward: number;
  merchantLabel: string;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
  /** S0 colour treatment being compared (Option 1 only). */
  badgeSkin?: BadgeSkin;
}

/**
 * Dispatches to the reveal interaction for the selected option. All run
 * S0 → tap → S2 (no S1): count-up-then-fly-to-CTA (1), count-up (2),
 * gift-box open (3), scratch wipe (4). Option 1's coin-fly + CTA highlight are
 * driven by the host via onRevealComplete.
 */
export function RewardTag({
  option,
  state,
  reward,
  merchantLabel,
  onTap,
  onRevealComplete,
  reducedMotion,
  badgeSkin,
}: RewardTagProps) {
  if (option === 1) {
    // Count up in place, then the host flies the coins onto the CTA.
    return (
      <RewardTagFlyToCta
        state={state}
        reward={reward}
        onTap={onTap}
        onRevealComplete={onRevealComplete}
        reducedMotion={reducedMotion}
        badgeSkin={badgeSkin}
      />
    );
  }

  if (option === 2) {
    return (
      <RewardTagCountUp
        state={state}
        reward={reward}
        onTap={onTap}
        onRevealComplete={onRevealComplete}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (option === 3) {
    return (
      <RewardTagGiftBox
        state={state}
        reward={reward}
        onTap={onTap}
        onRevealComplete={onRevealComplete}
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <RewardTagWipe
      state={state}
      reward={reward}
      merchantLabel={merchantLabel}
      onTap={onTap}
      onRevealComplete={onRevealComplete}
      reducedMotion={reducedMotion}
    />
  );
}

export default RewardTag;
