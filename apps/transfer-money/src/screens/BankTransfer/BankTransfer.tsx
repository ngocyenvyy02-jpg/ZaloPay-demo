// DS reuse first (hard rule 2): import { NavigationBar, ... } from "@zlp/design-system";
// zlp-icons (svgr, note the baked-fill tint trap):
//   import FooIcon from "../../../../../zlp-icons/Second/foo.svg?react";
// App assets (sibling of src/): import bar from "../../../assets/bar.png";
import { useState } from "react";
import {
  AmountDisplay,
  Button,
  Dialog,
  NavigationBar,
  NumericKeyboard,
  Sheet,
  playHapticRigid,
} from "@zlp/design-system";
import BankIcon from "../../../../../zlp-icons/Second/general_bank.svg?react";
import UsersIcon from "../../../../../zlp-icons/Second/general_users.svg?react";
import SalaryIcon from "../../../../../zlp-icons/Second/general_salary_subtract.svg?react";
import GiftboxIcon from "../../../../../zlp-icons/Second/general_navbar_giftbox_line.svg?react";
import ChevronDownIcon from "../../../../../zlp-icons/Second/general_arrow_down1.svg?react";
import QuestionIcon from "../../../../../zlp-icons/Second/general_question_solid.svg?react";
import hdbankLogo from "../../../../../zlp-icons/Bank/HDBank.svg";
import scanIcon from "../../../assets/scan-icon.svg";
import zlpCoin from "../../../assets/zlp-coin.svg";
import vietcombankLogo from "../../../assets/vietcombank-logo.svg";
import edgecaseError from "../../../assets/edgecase-error.svg";
import edgecaseNoInternet from "../../../assets/edgecase-no-internet.svg";
import { StatusContent } from "../../localComponent/StatusContent";
import styles from "./BankTransfer.module.css";

/** Edge-case overlays/states (from Figma "Edge cases" cluster). */
export type OverlayKind =
  | "confirm"
  | "error-txn"
  | "error-backend"
  | "offline"
  | "maintenance";

export interface BankTransferProps {
  /** Seed an edge-case state (deep-link preview tooling — NOT in-app nav). */
  initialOverlay?: OverlayKind;
  onSelectService?: (service: string) => void;
  onConfirmTransfer?: (recipientKey: string) => void;
  onSeeMore?: () => void;
  onScan?: () => void;
  onCoin?: () => void;
}

/** Số tiền tối đa hiển thị được — 9 chữ số (z-taste cap). */
const MAX_DIGITS = 9;

const SERVICES: { key: string; label: string; Icon: typeof BankIcon }[] = [
  { key: "bank", label: "Ngân hàng", Icon: BankIcon },
  { key: "zalopay", label: "Zalopay", Icon: UsersIcon },
  { key: "luckymoney", label: "Tiền mừng", Icon: SalaryIcon },
  { key: "gift", label: "Đổi quà", Icon: GiftboxIcon },
];

interface Recipient {
  key: string;
  name: string;
  account: string;
  logo?: string;
  initials?: string;
}

/** Người nhận gần đây (dữ liệu mẫu — bank symbol có thật trong repo). */
const RECIPIENTS: Recipient[] = [
  { key: "r1", name: "VO THANH HUY", account: "1041957013", logo: vietcombankLogo },
  { key: "r2", name: "LE NGUYEN PHUONG", account: "0355123456", logo: hdbankLogo },
  { key: "r3", name: "Nam Dat", account: "1902888777", initials: "ND" },
];

/** Recipient shown in the confirm sheet when seeded from a deep-link. */
const DEFAULT_CONFIRM: Recipient = {
  key: "figma",
  name: "CONG TY TNHH LIEN HOA",
  account: "1041957013",
  logo: vietcombankLogo,
};

export function BankTransfer({
  initialOverlay,
  onSelectService,
  onConfirmTransfer,
  onSeeMore,
  onScan,
  onCoin,
}: BankTransferProps) {
  const [amount, setAmount] = useState(initialOverlay ? "500000" : "");
  const [note, setNote] = useState("");
  const [shake, setShake] = useState(false);
  const [overlay, setOverlay] = useState<OverlayKind | null>(initialOverlay ?? null);
  const [confirmRecipient, setConfirmRecipient] = useState<Recipient>(DEFAULT_CONFIRM);

  const handleKey = (key: string) => {
    const next = (amount + key).replace(/^0+(?=\d)/, "").slice(0, 12);
    if (next.length > MAX_DIGITS) {
      setShake(true);
      window.setTimeout(() => setShake(false), 300);
      return;
    }
    setAmount(next);
  };

  const intent = (msg: string, cb?: () => void) => {
    if (cb) {
      cb();
      return;
    }
    console.info(`BankTransfer: ${msg} intent is not wired yet`);
  };

  const closeOverlay = () => setOverlay(null);

  // Full-screen maintenance state replaces the hub entirely.
  if (overlay === "maintenance") {
    return (
      <div className={styles.root}>
        <NavigationBar showBack={false} className={styles.navigation} />
        <div className={styles.maintenance}>
          <StatusContent
            illustration={edgecaseError}
            title="Hệ thống đang bảo trì"
            message="Hiện tại hệ thống đang bảo trì và sẽ sớm hoạt động trở lại, mong bạn thông cảm và quay lại sau nhé"
          >
            <Button version="2.0" size="48" fullWidth onClick={closeOverlay}>
              Đóng
            </Button>
          </StatusContent>
        </div>
      </div>
    );
  }

  const openConfirm = (recipient: Recipient) => {
    setConfirmRecipient(recipient);
    setOverlay("confirm");
  };

  return (
    <div className={styles.root}>
      <NavigationBar showBack={false} className={styles.navigation} />

      <div className={styles.navActions}>
        <button type="button" className={styles.navIconButton} aria-label="Quét mã QR" onClick={() => intent("scan", onScan)}>
          <img className={styles.scanIcon} src={scanIcon} alt="" />
        </button>
        <button type="button" className={styles.navIconButton} aria-label="Xu Zalopay" onClick={() => intent("coin", onCoin)}>
          <img className={styles.navCoin} src={zlpCoin} alt="" />
        </button>
      </div>

      <main className={styles.layout}>
        {/* Số tiền + ghi chú */}
        <section className={styles.amountSection} aria-label="Nhập số tiền chuyển">
          <AmountDisplay value={amount || "0"} unit="đ" shake={shake} size={56} className={styles.amount} />
          <div className={styles.noteField}>
            <input
              className={styles.noteInput}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú"
              aria-label="Ghi chú chuyển tiền"
              maxLength={50}
            />
            <span className={styles.noteDivider} aria-hidden="true" />
          </div>
          <div className={styles.amountSpace} aria-hidden="true" />
        </section>

        {/* Điểm đến */}
        <div className={styles.receiver}>
          <div className={styles.receiverTitle}>
            <h1>Chuyển tiền</h1>
          </div>

          <div className={styles.optionsRow} role="group" aria-label="Chọn hình thức chuyển">
            {SERVICES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                className={styles.optionItem}
                onClick={() => intent(`service:${key}`, onSelectService && (() => onSelectService(key)))}
              >
                <span className={styles.serviceIconBox}>
                  <Icon className={styles.serviceIcon} aria-hidden="true" />
                </span>
                <span className={styles.optionLabel}>{label}</span>
              </button>
            ))}
          </div>

          <div className={styles.optionsRow} role="group" aria-label="Người nhận gần đây">
            {RECIPIENTS.map((r) => (
              <button key={r.key} type="button" className={styles.optionItem} onClick={() => openConfirm(r)}>
                <span className={styles.avatarBox}>
                  {r.logo ? (
                    <img className={styles.avatarLogo} src={r.logo} alt="" />
                  ) : (
                    <span className={styles.avatarInitials}>{r.initials}</span>
                  )}
                </span>
                <span className={`${styles.optionLabel} ${styles.optionLabelTruncate}`}>{r.name}</span>
              </button>
            ))}

            <button type="button" className={styles.optionItem} onClick={() => intent("see-more", onSeeMore)}>
              <span className={styles.moreCircle}>
                <ChevronDownIcon className={styles.moreChevron} aria-hidden="true" />
              </span>
              <span className={`${styles.optionLabel} ${styles.optionLabelTruncate}`}>Xem thêm</span>
            </button>
          </div>
        </div>

        {/* Bàn phím số */}
        <div className={styles.keypad}>
          <NumericKeyboard
            size="large"
            onKeyPress={handleKey}
            onBackspace={() => setAmount((v) => v.slice(0, -1))}
            onLongPressBackspace={() => setAmount("")}
            onHaptic={playHapticRigid}
          />
        </div>
      </main>

      {/* Edge case: xác nhận người nhận (tray sheet) */}
      <Sheet variant="tray" open={overlay === "confirm"} onClose={closeOverlay}>
        <div className={styles.confirmSheet}>
          <div className={styles.confirmHeader}>
            <div className={styles.confirmBadgeRow}>
              <span className={styles.confirmBadge}>
                <QuestionIcon aria-hidden="true" />
              </span>
            </div>
            <div className={styles.confirmTitleGroup}>
              <p className={styles.confirmTitle}>
                Bạn có chắc chắn muốn tiếp tục chuyển đến người này?
              </p>
              <div className={styles.confirmCard}>
                <span className={styles.confirmCardLogo}>
                  {confirmRecipient.logo ? (
                    <img src={confirmRecipient.logo} alt="" />
                  ) : (
                    <span className={styles.avatarInitials}>{confirmRecipient.initials}</span>
                  )}
                </span>
                <span className={styles.confirmCardCopy}>
                  <span className={styles.confirmCardName}>{confirmRecipient.name}</span>
                  <span className={styles.confirmCardAccount}>STK: {confirmRecipient.account}</span>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.confirmButtons}>
            <Button version="2.0" size="48" variant="secondary" fullWidth className={styles.secondaryFilled} onClick={closeOverlay}>
              Quay lại
            </Button>
            <Button
              version="2.0"
              size="48"
              fullWidth
              onClick={() => {
                closeOverlay();
                intent(`confirm:${confirmRecipient.key}`, onConfirmTransfer && (() => onConfirmTransfer(confirmRecipient.key)));
              }}
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      </Sheet>

      {/* Edge case: không thể xử lý giao dịch */}
      <Dialog open={overlay === "error-txn"} onClose={closeOverlay}>
        <StatusContent
          illustration={edgecaseError}
          title="Không thể xử lý giao dịch"
          message="Hệ thống gặp sự cố khi xử lý giao dịch chuyển tiền, xin bạn vui lòng kiểm tra lại thông tin và thử lại nhé."
        >
          <Button version="2.0" size="40" fullWidth onClick={closeOverlay}>
            Đóng
          </Button>
        </StatusContent>
      </Dialog>

      {/* Edge case: lỗi backend chung */}
      <Dialog open={overlay === "error-backend"} onClose={closeOverlay} showClose={false}>
        <StatusContent
          illustration={edgecaseError}
          title="Đã có lỗi xảy ra"
          message="{Lỗi từ backend trả về}"
        >
          <Button version="2.0" size="40" fullWidth onClick={closeOverlay}>
            Thử lại
          </Button>
        </StatusContent>
      </Dialog>

      {/* Edge case: mất kết nối internet (tự retry, không nút / không đóng) */}
      <Dialog open={overlay === "offline"} showClose={false} closeOnOverlay={false}>
        <StatusContent
          illustration={edgecaseNoInternet}
          title="Không có kết nối internet"
          message="Dịch vụ gián đoạn cho thiếu kết nối internet, hệ thống sẽ tự động thử lại khi kết nối thành công"
        />
      </Dialog>
    </div>
  );
}

export default BankTransfer;
