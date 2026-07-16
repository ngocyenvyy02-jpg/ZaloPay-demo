# Transfer (Chuyển tiền) — context cho app `transfer-money`

> File này mô tả **ngữ cảnh nghiệp vụ + UX** của tính năng transfer để agent không
> phải hỏi lại mỗi lần. Convention chung của repo (DS, token, build, skill
> figma-to-code) nằm ở root `AGENTS.md`/`CLAUDE.md` — KHÔNG lặp lại ở đây.
>
> App này **git-ignored (private)**. Nguồn thiết kế: 2 file Figma
> - Transfer input/flow: `RyMInT6aDvGw8qmxzpZhEI` ("Transfer-Money")
> - Cashier subsystem: `WvbTIoZ3MUlvbVL7mRRsxy` ("Cashier")

## 1. Tính năng là gì

Luồng **chuyển tiền trong super-app ZaloPay**, kiểu **nhập-số-tiền-trước** (amount-first):
người dùng gõ số tiền → thêm ghi chú → chọn người nhận, rồi bàn giao sang
**Cashier** để chọn nguồn tiền + xác thực + ra kết quả.

Một flow, **2 nhánh** (quyết định theo loại người nhận):
- **P2P** — ví ZaloPay → ví ZaloPay (chuyển cho user khác).
- **IBFT** — chuyển qua **ngân hàng** (số tài khoản). Có **phí**: `3.100đ + 0.65% giá trị giao dịch`.

## 2. Các entry vào flow

1. **Hub chủ động** (màn app này build — `BankTransfer`): gõ số tiền → chọn điểm đến
   (Ngân hàng / Zalopay / Tiền mừng / Đổi quà) hoặc người nhận gần đây. Figma node
   `13292:195954` (base) và `12101:115266` (đã chọn người nhận).
2. **Từ QR** (màn `TransferMoney` / `TransferMoneyOption2` có sẵn): số tiền + người
   nhận **điền sẵn từ mã QR**, chỉ xác nhận. Đây là nhánh quét-mã (merchant/P2P).

Cả 2 entry dẫn về cùng một flow xác nhận → Cashier.

## 3. Màn transfer input — các state (Figma "Transfer-Money")

| State | Figma node | Mô tả |
|---|---|---|
| Base (chưa chọn ai) | `13292:195954` | số tiền + ghi chú + grid dịch vụ + người nhận gần đây + keypad |
| **Đã chọn người nhận** | `12101:115266` | grid biến mất → card "Chuyển đến" + **nút Tiếp tục hiện ra**. ✕ trên card → tray "bỏ chọn" |
| Tray "bỏ chọn người nhận" | (trên màn QR) | "Bạn có muốn bỏ chọn... ?" Không / Có |
| Sheet "chắc chắn muốn tiếp tục?" | `13292:75028` | **double-submit guard** — xem §5 |
| Dialog lỗi giao dịch | `10940:48400` | "Không thể xử lý giao dịch" + Đóng |
| Dialog lỗi backend | `11236:70697` | "Đã có lỗi xảy ra" + Thử lại |
| Dialog mất mạng | `11236:65514` | "Không có kết nối internet" — không nút, tự retry, không đóng |
| Full-screen bảo trì | `11229:57735` | "Hệ thống đang bảo trì" + Đóng |

**Tap người nhận = ĐIỀU HƯỚNG sang state "đã chọn"** (KHÔNG mở sheet). Keypad **luôn cố định**, không tắt được.

## 4. UX business rules (từ note thiết kế Figma — là rule thật, không suy đoán)

**Số tiền:**
- Tối đa **8 chữ số**. Chạm cap mà vẫn gõ → rung số + haptic (không cho nhập thêm).
- Tối đa **20.000.000đ**; vượt → hiện dòng thông báo **đỏ**.
- Tối thiểu: **P2P 1.000đ / IBFT 10.000đ**. Lỗi min **chỉ hiện khi bấm Tiếp tục**.
- Số animate trượt lên khi thêm, fadeOut khi xoá; tự giảm size khi chạm width màn hình.
- Long-press vào số tiền → option paste số từ clipboard (chỉ paste được số).
- Cursor: nhấp nháy liên tục khi = 0 hoặc đang gõ; khi ≠ 0 nhấp nháy 2.5s rồi tự ẩn.

**Nút "Tiếp tục":** chỉ hiện khi **số tiền > min VÀ đã chọn người nhận**.

**Ghi chú:**
- Auto-fill format `"A dùng Zalopay chuyển tiền"`.
- Tối đa **75 ký tự** (chạm max → hiện hint); tự trim nếu chỉ nhập khoảng trắng; có nút (x) xoá nhanh.
- Field nở theo số ký tự; **blur → thu gọn 1 dòng + "…"**.
- **Focus ghi chú** → fadeOut (card người nhận + Tiếp tục + bàn phím), fadeIn box gợi ý.
  Blur khi: bấm "Xong" trên bàn phím HOẶC tap ra ngoài vùng ghi chú/gợi ý → fadeIn lại UI.

**Bàn phím:** nhấn 2 phím cùng lúc được; phím nhấn spring-animate to lên + haptic
(giữ active khi long-press); **long-press phím xoá = xoá hết** số tiền.

## 5. Edge case đặc biệt — sheet "chắc chắn muốn tiếp tục?"

Không phải trigger bởi tap người nhận. **Trigger:** khi `onResume` KHÔNG bắn nhưng
user **đã từng qua Cashier** (chưa biết giao dịch đã xong hay chưa) rồi quay lại
màn input và bấm **Tiếp tục** → hiện sheet này (chống submit trùng). Bấm **Quay lại**
rồi bấm **Tiếp tục** lần nữa mà **chưa đổi người nhận** → sheet hiện lại.

## 6. Cashier — subsystem riêng (file Figma `WvbTIoZ3MUlvbVL7mRRsxy`)

Sau khi bấm **Tiếp tục** ở màn input, bàn giao sang **Cashier** ("New Cashier_1.x").
Cashier lo toàn bộ phần còn lại; màn input **không** đụng tới:

- **Chọn nguồn tiền (SOF)**: Số dư ví · Trả sau · Trả góp · **Số dư sinh lời (SDSL)** ·
  ngân hàng liên kết (vd Vietcombank ****5678) · VietQR (bất kì bank) · Apple Pay ·
  Napas (thẻ nội địa) · Visa/Master/JCB (thẻ quốc tế). Case: *ví đủ / ví không đủ
  (→ CTA "Nạp thêm" + gợi ý nguồn khác) / bank không hỗ trợ*.
- **Xu + Ưu đãi**: toggle xu, tray chọn ưu đãi; case apply success / failed / không có.
- **Chi tiết đơn hàng**: single/multi bill, phí dịch vụ, tooltip (i).
- **Đồng ý điều khoản** (tray) khi cần.
- **Xác thực**: Verify PIN (+ kích hoạt FaceID/TouchID) · TouchID/FaceID · **OTP**
  (nhánh "CHECK RULE OTP?").
- **Result page** (success/fail) — vd `result_page_ibft_success` (node `23307:81012`,
  file Transfer-Money): mã giao dịch, phí, +xu, card người nhận (số TK che + share),
  ghi chú; 2 CTA "Chuyển thêm" + 1 CTA cashier (Figma chưa đặt label thật).

> Cashier sẽ được cung cấp/triển khai riêng. Khi build màn input, chỉ cần expose intent
> "tiếp tục → cashier", KHÔNG tự dựng bước chọn nguồn tiền/xác thực trong app này.

## 7. Ngoài scope (đã chốt — đừng build)

- **SDSL** ở màn input (banner "mất 4.7%/năm…"): thuộc scope khác. (SDSL vẫn xuất hiện
  như 1 nguồn tiền TRONG Cashier — đó là chuyện của Cashier.)
- Section **K0** trong file Figma.
- Màn Cashier + nguồn tiền: chờ bổ sung.

## 8. Trạng thái code hiện tại vs design (GAP cần biết)

App hiện đã build hub + 5 edge case (xem `src/screens/BankTransfer/`). Một số điểm
**chưa khớp rule §4** (chưa sửa — chờ chốt):

- Cap số tiền đang **9 chữ số** → design là **8**.
- Ghi chú `maxLength` đang **50** → design là **75**; chưa có auto-fill/trim/nút (x)/
  fadeOut-suggestions/thu gọn "…".
- Chưa có **min/max + dòng lỗi đỏ**, chưa gate nút Tiếp tục theo min.
- **Tap người nhận** hiện đang mở thẳng sheet xác nhận → design là **điều hướng sang
  state "đã chọn"**; sheet "chắc chắn muốn tiếp tục" mới đúng là double-submit guard (§5).
- Chưa tách nhánh **P2P vs IBFT** (min/phí khác nhau).
- Illustration edge-case đang là **placeholder** (xem memory / Asset Report) — chờ export.

## 9. Reuse note riêng cho feature

- Số tiền = DS `AmountDisplay` (mặc định đã blue + unit `đ` dark-100).
- Bàn phím = DS `NumericKeyboard` size `large`.
- Sheet xác nhận/bỏ chọn = DS `Sheet` variant `tray`.
- Dialog lỗi/bảo trì = DS `Dialog` (đã thêm ở nhánh `feat/ds-dialog`).
- Card người nhận: border `1.5px stroke2`, radius `12`, logo 44 box / symbol 36.
