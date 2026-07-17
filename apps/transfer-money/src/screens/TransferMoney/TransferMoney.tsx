// DS reuse first (hard rule 2): import { NavigationBar, Button, ... } from "@zlp/design-system";
// zlp-icons (svgr, note the baked-fill tint trap):
//   import FooIcon from "../../../../../zlp-icons/Second/foo.svg?react";
// App assets (sibling of src/): import bar from "../../../assets/bar.png";
import { useCallback, useRef, useState } from "react";
import {
  AmountDisplay,
  Button,
  NavigationBar,
  playHapticRigid,
  playHapticSelection,
  Toggle,
} from "@zlp/design-system";
import CloseCircleIcon from "../../../../../zlp-icons/Second/general_closecircle_solid.svg?react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import scanIcon from "../../../assets/scan-icon.svg";
import vietcombankLogo from "../../../assets/vietcombank-logo.svg";
import zlpCoin from "../../../assets/zlp-coin.svg";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { CoinFly } from "../../localComponent/CoinFly";
import type { Point } from "../../localComponent/CoinFly";
import { DemoControlPanel } from "../../localComponent/DemoControlPanel";
import {
  formatReward,
  MERCHANT_LABEL,
  REWARD_BY_SEGMENT,
  RewardTag,
} from "../../localComponent/RewardTag";
import type {
  BadgeSkin,
  Merchant,
  OptionId,
  RevealState,
  SegmentId,
} from "../../localComponent/RewardTag";
import { TransferSuccess } from "../TransferSuccess";
import styles from "./TransferMoney.module.css";

export interface TransferMoneyProps {
  onContinue?: () => void;
  onRemoveRecipient?: () => void;
}

const RECIPIENT_NAME: Record<Merchant, string> = {
  BHX: "CONG TY CP TM BACH HOA XANH",
  WINMART: "CONG TY CO PHAN WINMART",
};

const PROMO_CODE: Record<Merchant, string> = {
  BHX: "BHX_Q3_2026",
  WINMART: "WM_Q3_2026",
};

/**
 * "Tag nhận xu" interaction demo (brief-tag-interaction-demo.md) — one host
 * screen, 3 selectable reveal options for the same tap. Reward is only ever
 * granted at S3 (TransferSuccess); S0/S1/S2 here stay gold/navy (guardrail 2).
 */
export function TransferMoney({
  onContinue,
  onRemoveRecipient,
}: TransferMoneyProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [saveAccount, setSaveAccount] = useState(false);
  const [option, setOption] = useState<OptionId>(1);
  const [segment, setSegment] = useState<SegmentId>("N");
  const [merchant, setMerchant] = useState<Merchant>("BHX");
  const [badgeSkin, setBadgeSkin] = useState<BadgeSkin>("soft");
  const [revealState, setRevealState] = useState<RevealState>("S0");
  const [flowStep, setFlowStep] = useState<"payment" | "success">("payment");
  // Bumped on every reset so the tag remounts (re-runs an option's reveal).
  const [replayNonce, setReplayNonce] = useState(0);
  // Option 1 hands the reward off to the CTA: when the count lands, coins fly
  // from the tag onto "Tiếp tục", which then lights up (label + a short pulse).
  const rootRef = useRef<HTMLDivElement>(null);
  const rewardSlotRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [fly, setFly] = useState<{ from: Point; to: Point } | null>(null);

  const reward = REWARD_BY_SEGMENT[segment];

  const resetReveal = () => {
    setRevealState("S0");
    setFlowStep("payment");
    setReplayNonce((n) => n + 1);
    setRewardClaimed(false);
    setFly(null);
  };

  const handleTap = () => {
    // No S1 — jump straight to S2; the count-up + reveal animation play there.
    playHapticSelection();
    setRevealState("S2");
  };
  // Crisp "landed" tick when the number settles — reinforces the reveal payoff
  // without a completion signal (guardrail 1: still one step left at S2).
  // useCallback keeps identity stable so the reveal-timer effects don't re-fire.
  const handleRevealComplete = useCallback(() => {
    playHapticRigid();
    if (option !== 1) return;
    // Option 1: fling the coins from the tag down onto the CTA. Reduced motion
    // (or a missing ref) skips the flight and just lights up the CTA.
    const root = rootRef.current;
    const slot = rewardSlotRef.current;
    const cta = ctaRef.current;
    if (reducedMotion || !root || !slot || !cta) {
      setRewardClaimed(true);
      return;
    }
    const r = root.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const c = cta.getBoundingClientRect();
    setFly({
      from: { x: s.left + s.width / 2 - r.left, y: s.top + s.height / 2 - r.top },
      to: { x: c.left + c.width / 2 - r.left, y: c.top + c.height / 2 - r.top },
    });
  }, [option, reducedMotion]);

  const handleFlyDone = useCallback(() => {
    setFly(null);
    setRewardClaimed(true);
  }, []);

  const handleOptionChange = (next: OptionId) => {
    setOption(next);
    resetReveal();
  };

  const handleSegmentChange = (next: SegmentId) => {
    setSegment(next);
    resetReveal();
  };

  const handleMerchantChange = (next: Merchant) => {
    setMerchant(next);
    resetReveal();
  };

  const handleContinue = () => {
    onContinue?.();
    setFlowStep("success");
  };

  const handleRemoveRecipient = () => {
    if (onRemoveRecipient) {
      onRemoveRecipient();
      return;
    }
    console.info("TransferMoney: remove-recipient intent is not wired yet");
  };

  if (flowStep === "success") {
    return (
      <TransferSuccess reward={reward} merchant={merchant} onDone={resetReveal} />
    );
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.scroll}>
        <NavigationBar showBack={false} className={styles.navigation} />

        <div className={styles.navActions} aria-hidden="true">
          <img className={styles.scanIcon} src={scanIcon} alt="" />
          <img className={styles.navCoin} src={zlpCoin} alt="" />
        </div>

        <main className={styles.content}>
          <section className={styles.amountSection} aria-label="Thông tin thanh toán">
            <div className={styles.amountContent}>
              <p className={styles.hint}>Số tiền và ghi chú đã được điền từ mã QR</p>
              <AmountDisplay
                value="500000"
                unit="đ"
                cursor={false}
                size={56}
                className={styles.amount}
              />
              <input
                className={styles.noteInput}
                aria-label="Ghi chú thanh toán"
                value={PROMO_CODE[merchant]}
                readOnly
              />
            </div>

            <div className={styles.rewardSlot} ref={rewardSlotRef}>
              <RewardTag
                key={replayNonce}
                option={option}
                state={revealState}
                reward={reward}
                merchantLabel={MERCHANT_LABEL[merchant]}
                onTap={handleTap}
                onRevealComplete={handleRevealComplete}
                reducedMotion={reducedMotion}
                badgeSkin={badgeSkin}
              />
            </div>
          </section>

          <section className={styles.recipientSection} aria-labelledby="recipient-title">
            <div className={styles.recipientHeading}>
              <h1 id="recipient-title">Chuyển đến</h1>
              <div className={styles.saveAccount}>
                <span>Lưu tài khoản</span>
                <Toggle
                  checked={saveAccount}
                  size="S"
                  name="save-account"
                  onChange={setSaveAccount}
                />
              </div>
            </div>

            <div className={styles.recipientCard}>
              <div className={styles.bankLogoBox}>
                <img src={vietcombankLogo} alt="Vietcombank" />
              </div>
              <div className={styles.recipientCopy}>
                <p className={styles.recipientName}>{RECIPIENT_NAME[merchant]}</p>
                <p className={styles.accountNumber}>STK: 1041957013</p>
              </div>
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemoveRecipient}
                aria-label="Xóa người nhận"
              >
                <CloseCircleIcon aria-hidden="true" />
              </button>
            </div>
          </section>

          <div className={styles.buttonSection}>
            <div
              ref={ctaRef}
              className={`${styles.ctaWrap} ${rewardClaimed ? styles.ctaClaimed : ""}`}
            >
              <Button
                version="2.0"
                size="48"
                fullWidth
                onClick={handleContinue}
                iconRight={
                  rewardClaimed ? (
                    <CoinIcon className={styles.ctaCoin} aria-hidden="true" />
                  ) : undefined
                }
              >
                {rewardClaimed
                  ? `Tiếp tục để nhận +${formatReward(reward)}`
                  : "Tiếp tục"}
              </Button>
            </div>
          </div>

          <div className={styles.keyboardSpace} aria-hidden="true" />
        </main>
      </div>

      {fly && (
        <CoinFly
          from={fly.from}
          to={fly.to}
          reducedMotion={reducedMotion}
          onDone={handleFlyDone}
        />
      )}

      <DemoControlPanel
        option={option}
        onOptionChange={handleOptionChange}
        segment={segment}
        onSegmentChange={handleSegmentChange}
        merchant={merchant}
        onMerchantChange={handleMerchantChange}
        badgeSkin={badgeSkin}
        onBadgeSkinChange={setBadgeSkin}
        onReplay={resetReveal}
      />
    </div>
  );
}

export default TransferMoney;
