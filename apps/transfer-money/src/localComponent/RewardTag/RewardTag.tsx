import type { OptionId, RevealState } from "./types";
import { RewardTagS2Default } from "./RewardTagS2Default";
import { RewardTagCountUp } from "./RewardTagCountUp";
import { RewardTagSpringPill } from "./RewardTagSpringPill";
import { RewardTagWipe } from "./RewardTagWipe";

export interface RewardTagProps {
  option: OptionId;
  state: RevealState;
  reward: number;
  merchantLabel: string;
  onTap: () => void;
  onRevealComplete: () => void;
  reducedMotion: boolean;
}

/**
 * Dispatches to the reveal interaction for the selected option (brief §6).
 * Each option owns its OWN resting state (S0) so the three read differently
 * before any tap: option 1 = value-forward count-up, option 2 = two-step
 * progress, option 3 = scratch-card foil. Option 1 and 2 keep their own shell
 * through S2; option 3 hands off to RewardTagS2Default.
 */
export function RewardTag({
  option,
  state,
  reward,
  merchantLabel,
  onTap,
  onRevealComplete,
  reducedMotion,
}: RewardTagProps) {
  if (option === 1) {
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

  if (option === 2) {
    return (
      <RewardTagSpringPill
        state={state}
        reward={reward}
        onTap={onTap}
        onRevealComplete={onRevealComplete}
        reducedMotion={reducedMotion}
      />
    );
  }

  // option 3 — scratch card
  if (state === "S2") return <RewardTagS2Default reward={reward} />;
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
