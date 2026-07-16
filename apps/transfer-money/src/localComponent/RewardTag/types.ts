export type OptionId = 1 | 2 | 3 | 4;
export type SegmentId = "N" | "F" | "R";
export type Merchant = "BHX" | "WINMART";
/** No S1: tap goes straight to S2, where the count-up + reveal animation play. */
export type RevealState = "S0" | "S2";

/** Brief §4 — reward per user segment (coins, not the payment amount). */
export const REWARD_BY_SEGMENT: Record<SegmentId, number> = {
  N: 30000,
  F: 10000,
  R: 100,
};

export const MERCHANT_LABEL: Record<Merchant, string> = {
  BHX: "BHX",
  WINMART: "Winmart",
};

export function formatReward(value: number): string {
  return value.toLocaleString("vi-VN");
}
