import type { OptionId, RevealState } from "./types";
import { RewardTagAutoCount } from "./RewardTagAutoCount";
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
}

/**
 * Dispatches to the reveal interaction for the selected option (brief §6).
 * Options 1–3 run S0 → S2 (no S1): each owns its resting invite (S0) and its
 * reveal-into-settled S2 — count-up (1), gift-box open (2), scratch wipe (3).
 * Option 4 has no S0/tap at all: the reward is shown and counts up on entry.
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
      <RewardTagGiftBox
        state={state}
        reward={reward}
        onTap={onTap}
        onRevealComplete={onRevealComplete}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (option === 4) {
    // No S0, no tap — the reward shows and counts up on entry.
    return (
      <RewardTagAutoCount
        reward={reward}
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
