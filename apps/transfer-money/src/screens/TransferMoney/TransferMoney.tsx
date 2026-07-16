// DS reuse first (hard rule 2): import { NavigationBar, Button, ... } from "@zlp/design-system";
// zlp-icons (svgr, note the baked-fill tint trap):
//   import FooIcon from "../../../../../zlp-icons/Second/foo.svg?react";
// App assets (sibling of src/): import bar from "../../../assets/bar.png";
import { useCallback, useState } from "react";
import {
  AmountDisplay,
  Button,
  NavigationBar,
  playHapticRigid,
  playHapticSelection,
  Toggle,
} from "@zlp/design-system";
import CloseCircleIcon from "../../../../../zlp-icons/Second/general_closecircle_solid.svg?react";
import scanIcon from "../../../assets/scan-icon.svg";
import vietcombankLogo from "../../../assets/vietcombank-logo.svg";
import zlpCoin from "../../../assets/zlp-coin.svg";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { DemoControlPanel } from "../../localComponent/DemoControlPanel";
import { MERCHANT_LABEL, REWARD_BY_SEGMENT, RewardTag } from "../../localComponent/RewardTag";
import type {
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
  const [revealState, setRevealState] = useState<RevealState>("S0");
  const [flowStep, setFlowStep] = useState<"payment" | "success">("payment");
  // Bumped on every reset so the tag remounts — this is what re-runs Option 4's
  // auto count-up on Replay (it has no S0/tap to re-trigger it).
  const [replayNonce, setReplayNonce] = useState(0);

  const reward = REWARD_BY_SEGMENT[segment];

  const resetReveal = () => {
    setRevealState("S0");
    setFlowStep("payment");
    setReplayNonce((n) => n + 1);
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
    <div className={styles.root}>
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

            <div className={styles.rewardSlot}>
              <RewardTag
                key={replayNonce}
                option={option}
                state={revealState}
                reward={reward}
                merchantLabel={MERCHANT_LABEL[merchant]}
                onTap={handleTap}
                onRevealComplete={handleRevealComplete}
                reducedMotion={reducedMotion}
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
            <Button
              version="2.0"
              size="48"
              fullWidth
              onClick={handleContinue}
            >
              Tiếp tục
            </Button>
          </div>

          <div className={styles.keyboardSpace} aria-hidden="true" />
        </main>
      </div>

      <DemoControlPanel
        option={option}
        onOptionChange={handleOptionChange}
        segment={segment}
        onSegmentChange={handleSegmentChange}
        merchant={merchant}
        onMerchantChange={handleMerchantChange}
        onReplay={resetReveal}
      />
    </div>
  );
}

export default TransferMoney;
