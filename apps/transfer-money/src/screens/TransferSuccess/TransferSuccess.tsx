import { AmountDisplay, ButtonLink, Ribbon } from "@zlp/design-system";
import ArrowDownIcon from "../../../../../zlp-icons/Second/general_arrow_down6.svg?react";
import ArrowNextIcon from "../../../../../zlp-icons/Second/general_arrow_next4.svg?react";
import CheckIcon from "../../../../../zlp-icons/Second/general_check_line.svg?react";
import InfoIcon from "../../../../../zlp-icons/Second/general_info_line.svg?react";
import ShareIcon from "../../../../../zlp-icons/Second/general_share.svg?react";
import TagsIcon from "../../../../../zlp-icons/Second/general_tags.svg?react";
import CoinIcon from "../../../../../zlp-icons/Second/service_coin.svg?react";
import insuranceAccent from "../../../assets/cyber-insurance-accent.svg";
import insuranceShield from "../../../assets/cyber-insurance-shield-export.png";
import receiptEdge from "../../../assets/transfer-receipt-edge.svg";
import watermarkBase from "../../../assets/transfer-receipt-watermark-base.svg";
import watermarkBottom from "../../../assets/transfer-receipt-watermark-bottom.svg";
import watermarkTop from "../../../assets/transfer-receipt-watermark-top.svg";
import promoBanner from "../../../assets/transfer-promo-banner.png";
import headerBackground from "../../../assets/transfer-success-header.svg";
import vietcombankLogo from "../../../assets/vietcombank-logo.svg";
import { formatReward } from "../../localComponent/RewardTag";
import type { Merchant } from "../../localComponent/RewardTag";
import styles from "./TransferSuccess.module.css";

export interface TransferSuccessProps {
  reward: number;
  merchant?: Merchant;
  onDone?: () => void;
}

const RECIPIENT_NAME: Record<Merchant, string> = {
  BHX: "CONG TY TNHH LIEN HOA",
  WINMART: "CONG TY CO PHAN WINMART",
};

/**
 * Transfer receipt / S3 payoff from Figma node 27245:233259. App-level
 * StatusBar and AppControl remain owned by the shell.
 */
export function TransferSuccess({
  reward,
  merchant = "BHX",
  onDone,
}: TransferSuccessProps) {
  const logIntent = (intent: string) => {
    console.info(`TransferSuccess: ${intent} intent is not wired yet`);
  };

  const handleTransferAgain = () => {
    if (onDone) {
      onDone();
      return;
    }
    logIntent("transfer-again");
  };

  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        <section className={styles.receipt} aria-labelledby="success-title">
          <img
            className={styles.headerBackground}
            src={headerBackground}
            alt=""
            aria-hidden="true"
          />

          <div className={styles.receiptContent}>
            <CheckIcon className={styles.successIcon} aria-hidden="true" />

            <h1 id="success-title" className={styles.title}>
              Chuyển tiền thành công
            </h1>

            <div className={styles.transactionDetails}>
              <div className={styles.amountRow}>
                <AmountDisplay
                  value="506350"
                  unit="đ"
                  cursor={false}
                  size={36}
                  textAlign="left"
                  className={styles.amountDisplay}
                />
                <button
                  type="button"
                  className={styles.amountDetailButton}
                  onClick={() => logIntent("amount-detail")}
                  aria-label="Xem chi tiết số tiền"
                >
                  <ArrowDownIcon aria-hidden="true" />
                </button>
                <span className={styles.rewardChip} aria-label={`Được cộng ${formatReward(reward)} xu`}>
                  <strong>+{formatReward(reward)}</strong>
                  <CoinIcon aria-hidden="true" />
                </span>
              </div>

              <button
                type="button"
                className={styles.transactionCode}
                onClick={() => logIntent("transaction-detail")}
              >
                <span>
                  Mã giao dịch: <strong>#250820000017761</strong>
                </span>
                <ArrowNextIcon aria-hidden="true" />
              </button>

              <p className={styles.time}>Thời gian: 07:00 - 06/09/2019</p>

              <div className={styles.feeChip}>
                <TagsIcon aria-hidden="true" />
                <span>Phí: 6.350đ (3.100đ + 0.65% giá trị giao dịch)</span>
              </div>
            </div>

            <div className={styles.recipientBlock}>
              <article className={styles.recipientCard}>
                <div className={`${styles.watermark} ${styles.watermarkLeft}`} aria-hidden="true">
                  <img src={watermarkBase} alt="" />
                  <img src={watermarkTop} alt="" />
                </div>
                <div className={`${styles.watermark} ${styles.watermarkRight}`} aria-hidden="true">
                  <img src={watermarkBase} alt="" />
                  <img src={watermarkBottom} alt="" />
                </div>

                <div className={styles.recipientTop}>
                  <div className={styles.bankLogo}>
                    <img src={vietcombankLogo} alt="Vietcombank" />
                  </div>
                  <div className={styles.recipientCopy}>
                    <p className={styles.recipientName}>{RECIPIENT_NAME[merchant]}</p>
                    <p className={styles.account}>Vietcombank **** 7013</p>
                  </div>
                  <button
                    type="button"
                    className={styles.shareButton}
                    onClick={() => logIntent("share-receipt")}
                    aria-label="Chia sẻ biên nhận"
                  >
                    <ShareIcon aria-hidden="true" />
                  </button>
                </div>

                <p className={styles.note}>
                  <strong>Ghi chú</strong>: Tu Le dung Zalopay chuyen tien
                </p>
              </article>

              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.secondaryAction}
                  onClick={() => logIntent("cashier-action")}
                >
                  CTA (cashier)
                </button>
                <button
                  type="button"
                  className={styles.secondaryAction}
                  onClick={handleTransferAgain}
                >
                  Chuyển thêm
                </button>
              </div>
            </div>
          </div>
        </section>

        <img className={styles.receiptEdge} src={receiptEdge} alt="" aria-hidden="true" />

        <section className={styles.exclusive} aria-labelledby="exclusive-title">
          <h2 id="exclusive-title">Dành riêng chuyển tiền</h2>

          <button
            type="button"
            className={styles.promoCard}
            onClick={() => logIntent("open-reward-store")}
          >
            <span className={styles.promoMedia}>
              <img src={promoBanner} alt="Chào mừng 2026" />
            </span>
            <span className={styles.promoFooter}>
              <span className={styles.promoCopy}>
                <strong>Đổi quà tại Cửa hàng Quét QR</strong>
                <span className={styles.promoSubtitle}>
                  Đổi quà đặc quyền chỉ từ 1
                  <CoinIcon aria-label="xu" />
                </span>
              </span>
              <ArrowNextIcon className={styles.promoArrow} aria-hidden="true" />
            </span>
          </button>

          <article className={styles.insuranceCard}>
            <Ribbon type="1" color="green" className={styles.insuranceRibbon}>
              Hoàn 3.000đ
            </Ribbon>

            <div className={styles.insuranceVisual} aria-hidden="true">
              <img className={styles.insuranceAccent} src={insuranceAccent} alt="" />
              <img className={styles.insuranceShield} src={insuranceShield} alt="" />
            </div>

            <div className={styles.insuranceCopy}>
              <div className={styles.insuranceTitleRow}>
                <strong>Bảo hiểm an ninh mạng</strong>
                <button
                  type="button"
                  className={styles.infoButton}
                  onClick={() => logIntent("insurance-info")}
                  aria-label="Thông tin bảo hiểm an ninh mạng"
                >
                  <InfoIcon aria-hidden="true" />
                </button>
              </div>
              <p>Bảo vệ trước các rủi ro lừa đảo</p>
              <div className={styles.insurancePriceRow}>
                <span>
                  <strong>3.000đ</strong>/ tháng •
                </span>
                <ButtonLink
                  size="14"
                  bold
                  onClick={() => logIntent("buy-insurance")}
                >
                  Mua ngay
                </ButtonLink>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export default TransferSuccess;
