# Transfer (Chuyển tiền) — feature context

> Context nghiệp vụ + thiết kế của app `transfer-money`, để agent prototype đúng
> xuyên nhiều màn mà không phải hỏi lại. Convention chung của repo (DS, token,
> build, skill figma-to-code) ở root `AGENTS.md` — KHÔNG lặp ở đây.
>
> **Nguồn thiết kế (Figma):**
> - Transfer input/flow: fileKey `RyMInT6aDvGw8qmxzpZhEI` ("Transfer-Money")
> - Cashier: fileKey `WvbTIoZ3MUlvbVL7mRRsxy` ("Cashier")

---

## 1. Tính năng là gì · Phạm vi · Function liên quan

**Chuyển tiền trong super-app ZaloPay**, kiểu **amount-first**: gõ số tiền trước →
ghi chú → chọn người nhận → bàn giao sang Cashier để trả tiền.

Một flow, **2 nhánh** (quyết định bởi loại người nhận):
| Nhánh | Nghĩa | Min | Phí |
|---|---|---|---|
| **P2P** | ví ZaloPay → ví ZaloPay | 1.000đ | không |
| **IBFT** | chuyển qua **ngân hàng** (STK) | 10.000đ | `3.100đ + 0.65%` giá trị GD |

**Trong phạm vi app này** (`apps/transfer-money`):
- Màn **input** (số tiền + ghi chú + chọn người nhận) và mọi state của nó.
- Các **edge case** của màn input (lỗi/mất mạng/bảo trì/xác nhận).

**Liên quan nhưng KHÔNG build ở đây** (subsystem riêng, chỉ expose intent):
- **Home** — nơi user bấm **icon "Chuyển tiền"** để vào flow. Design sẽ bổ sung sau.
- **Cashier** — chọn nguồn tiền, xu/ưu đãi, chi tiết đơn, điều khoản, xác thực
  (PIN/FaceID/OTP), → result page. File Figma riêng.
- **Result page** — kết quả GD (mã GD, phí, +xu, card người nhận, CTA "Chuyển thêm").
- **QR scanner** — entry quét mã.

**Ngoài scope (đã chốt, đừng build):**
- **SDSL** (Số dư sinh lời) ở màn input — banner "mất đặc quyền 4.7%/năm…" thuộc scope
  khác. *(SDSL vẫn là 1 nguồn tiền BÊN TRONG Cashier — đó là việc của Cashier.)*
- Section **K0** trong file Figma.

---

## 2. Ngôn ngữ thiết kế · Tone

**Nguyên tắc thị giác**
- **Số tiền là nhân vật chính**: 56/56 bold, `--color-primary-blue` (#0033c9), canh giữa
  vùng trên. Đơn vị `đ` 24/32 regular `--color-variant-dark-100` (#ccd2d8) — cố tình mờ
  để không tranh với con số.
- **Bàn phím luôn hiện, neo đáy**, nền `rgba(245,249,255,0.65)` (blue-tint rất nhạt),
  phím số blue bold 24/34. Bàn phím là một phần của màn, KHÔNG phải overlay.
- **Nền trắng, ít chrome**: không nav title, chỉ scan + xu (trái) và `••• ✕` (phải).
- **Xanh = hành động**; xám = phụ/placeholder; đỏ = lỗi; cam/vàng = phần thưởng/xu.

**Typography** (SF Pro Display)
| Vai trò | Size/LH | Weight |
|---|---|---|
| Số tiền | 56/56 | Bold |
| Heading S18 | 18/28 | Regular (label mờ) / Bold (title sheet-dialog) |
| Body S16 | 16/24 (paragraph) · 16/20 (label) | Regular |
| Label S14 | 14/18 | Regular / Bold (nút) |

**Hình khối**: radius `8` (nút, card nhỏ) · `12` (card người nhận, dialog) · `24` (DS
Sheet surface) · circle (avatar, badge). Viền card: `1.5px` `--color-other-stroke2`.

**Motion / cảm giác**
- Mobile-only: **không hover**, chỉ tap/press. Press scale `0.99`.
- Phím số: **spring animate to lên** + **haptic**; giữ active khi long-press.
- Số tiền: trượt lên khi thêm, fadeOut khi xoá; tự co size khi chạm width.
- Dialog: fade + scale. Sheet: slide-up (drawer easing).

**Tone chữ (rất quan trọng — copy phải giữ giọng này)**
- Xưng **"bạn"**, thân thiện, mềm, hay kết bằng **"nhé"**.
  VD: *"…xin bạn vui lòng kiểm tra lại thông tin và thử lại nhé."*
- Lỗi **không đổ lỗi user**, luôn quy về hệ thống + gợi ý hành động tiếp theo.
  VD: *"Hệ thống gặp sự cố khi xử lý giao dịch…"*, *"…mong bạn thông cảm và quay lại sau nhé"*.
- Câu hỏi xác nhận dùng dạng **"Bạn có chắc chắn muốn…?"** / **"Bạn có muốn…?"**.
- Tiếng Việt có dấu. Tên người nhận từ ngân hàng thì IN HOA không dấu (VD `CONG TY TNHH LIEN HOA`).

---

## 3. Bối cảnh user · Journey · Entry → đạt được gì

**Bối cảnh**: user cầm điện thoại **một tay**, muốn chuyển tiền **nhanh** cho người quen
hoặc một STK ngân hàng. Ưu tiên: gõ số tiền tức thì (bàn phím sẵn), chọn lại người đã
chuyển trước đó chỉ bằng 1 chạm.

**2 entry, cùng 1 flow**
1. **Hub chủ động** — từ **trang Home** bấm **icon "Chuyển tiền"** → vào màn input, tự gõ
   số tiền, tự chọn người nhận. *(Design Home sẽ bổ sung sau.)*
2. **Từ QR** — quét mã → **số tiền + ghi chú + người nhận điền sẵn**, user chỉ xác nhận.

**User journey**
```
[HOME → icon "Chuyển tiền"]   |   [QR scan]
      ↓
Nhập số tiền  →  (tùy chọn) thêm ghi chú
      ↓
Chọn người nhận  →  state "đã chọn" (nút Tiếp tục xuất hiện)
      ↓  Tiếp tục
CASHIER: chọn nguồn tiền → xu/ưu đãi → (điều khoản) → xác thực (PIN/FaceID/OTP)
      ↓
RESULT PAGE: mã GD, phí, +xu, card người nhận  →  CTA "Chuyển thêm"
```

**Đạt được gì**: tiền đã chuyển, có **bằng chứng giao dịch** (mã GD + thông tin người
nhận có thể share), nhận **xu thưởng**, và có lối **chuyển tiếp** ngay (Chuyển thêm).

---

## 4. Edge case · Ghi chú tránh lặp lỗi

**Các edge case của màn input**
| Case | Dạng | Hành vi |
|---|---|---|
| Không thể xử lý giao dịch | Dialog canh giữa (có ✕) | nút **Đóng** |
| Đã có lỗi xảy ra `{lỗi backend}` | Dialog (không ✕) | nút **Thử lại** |
| Không có kết nối internet | Dialog (không ✕) | **không nút**, **không đóng được** — hệ thống tự retry khi có mạng |
| Hệ thống đang bảo trì | **Full-screen** (thay cả màn) | nút **Đóng** |
| Xác nhận chuyển (double-submit) | Sheet `tray` | **Quay lại** / **Tiếp tục** — xem §5 |
| Bỏ chọn người nhận | Sheet `tray` | **Không** / **Có** |

**⚠️ Ghi chú tránh lặp lỗi (đã từng sai)**
- **Tap người nhận KHÔNG mở sheet xác nhận.** Nó **điều hướng sang state "đã chọn"**.
  Sheet "Bạn có chắc chắn muốn tiếp tục…" là **double-submit guard**, trigger hoàn toàn
  khác (§5).
- **Bàn phím luôn cố định, không tắt được** — đừng thiết kế state "ẩn bàn phím".
  (Ngoại lệ duy nhất: khi **focus ghi chú** thì bàn phím số fadeOut, xem §6.)
- **Không tự bịa màn đích** cho các mục chưa có design (xem §"Còn thiếu" cuối file).
- Illustration edge-case (`edgecase-error.svg`, `edgecase-no-internet.svg`) hiện là
  **placeholder trung tính** — chờ export thật, ghi đè đúng tên file là xong.

---

## 5. Business rule

**Số tiền**
- Tối đa **8 chữ số**. Chạm cap mà vẫn gõ → **rung số + haptic** (không nhập thêm).
- Tối đa **20.000.000đ** → vượt thì hiện **dòng thông báo đỏ**.
- Tối thiểu: **P2P 1.000đ / IBFT 10.000đ**. **Lỗi min CHỈ hiện khi bấm Tiếp tục.**
- Long-press vào số tiền → option **paste từ clipboard** (chỉ nhận số).
- Cursor: nhấp nháy liên tục khi `= 0` hoặc đang gõ; khi `≠ 0` nhấp nháy **2.5s rồi tự ẩn**.

**Nút "Tiếp tục"**: chỉ **xuất hiện** khi **số tiền > min VÀ đã chọn người nhận**.

**Ghi chú**
- Auto-fill format **`"A dùng Zalopay chuyển tiền"`**.
- Tối đa **75 ký tự** → chạm max hiện hint.
- Tự **trim** nếu user chỉ nhập khoảng trắng. Có nút **(x)** xoá nhanh khi đã nhập.
- Field **nở** theo số ký tự; **blur → thu gọn 1 dòng + "…"**.

**Phí IBFT**: `3.100đ + 0.65%` giá trị giao dịch (hiển thị ở Cashier/Result).

**Bàn phím**: cho phép **nhấn 2 phím cùng lúc**; **long-press ⌫ = xoá hết** số tiền.

---

## 6. Config theo màn hình / chuỗi hành động

**Màn input — state BASE** (chưa chọn người nhận)
| Hành động | Kết quả |
|---|---|
| Gõ phím số | số tiền cập nhật (animate trượt lên) + haptic |
| Long-press ⌫ | xoá sạch số tiền |
| Gõ vượt 8 số | rung số + haptic, không nhận |
| Nhập > 20tr | hiện dòng lỗi đỏ |
| **Tap người nhận gần đây** | → **state ĐÃ CHỌN** (grid biến mất, hiện card + Tiếp tục) |
| **Focus "Thêm ghi chú"** | hiện cursor, ẩn placeholder · **fadeOut** (UI chuyển đến + Tiếp tục + bàn phím) · **fadeIn box gợi ý** |
| Blur ghi chú (bấm "Xong" / tap ra ngoài) | **fadeIn lại** toàn bộ UI + bàn phím · thu gọn 1 dòng "…" |
| Tap dịch vụ (Ngân hàng/Zalopay/Tiền mừng/Đổi quà) | ❓ chưa có design đích — xem §"Còn thiếu" |
| Tap "Xem thêm" | ❓ chưa có design đích |
| Tap scan / xu | ❓ chưa có design đích |

**Màn input — state ĐÃ CHỌN NGƯỜI NHẬN**
| Hành động | Kết quả |
|---|---|
| (vào state) | grid dịch vụ + người nhận **biến mất**; hiện label "Chuyển đến" + **card người nhận** + **nút Tiếp tục** |
| **Tap ✕ trên card** | → sheet **"Bạn có muốn bỏ chọn chuyển tiền đến người nhận này?"** (Không / Có) |
| Sheet bỏ chọn → **Có** | bỏ người nhận → quay lại state BASE |
| Sheet bỏ chọn → **Không** | đóng sheet, giữ nguyên |
| **Bấm Tiếp tục** (hợp lệ) | → **Cashier** |
| Bấm Tiếp tục (số tiền < min) | hiện **dòng lỗi đỏ** min (đây là lúc duy nhất lỗi min hiện) |
| Bấm Tiếp tục (case double-submit) | → sheet xác nhận (§dưới) |

**Sheet "Bạn có chắc chắn muốn tiếp tục chuyển đến người này?" — double-submit guard**
- **Trigger**: `onResume` **KHÔNG** bắn + user **đã từng qua Cashier** (chưa rõ GD đã thực
  hiện hay chưa) + quay lại màn input và **bấm Tiếp tục**.
- **Quay lại** → đóng sheet. Bấm **Tiếp tục lần nữa mà CHƯA đổi người nhận** → **sheet hiện lại**.
- **Tiếp tục** → đi tiếp sang Cashier.

**Cashier (subsystem riêng — chỉ để biết, không build ở app này)**
`chọn nguồn tiền (ví/trả sau/trả góp/SDSL/bank liên kết/VietQR/ApplePay/Napas/Visa-Master-JCB)`
→ `xu + ưu đãi (toggle xu, tray chọn ưu đãi, apply success|failed)`
→ `chi tiết đơn hàng (single|multi bill, phí dịch vụ, tooltip i)`
→ `(tray đồng ý điều khoản nếu cần)`
→ `xác thực: PIN (+bật FaceID/TouchID) | FaceID/TouchID | OTP`
→ **Result page**.
Case nguồn tiền: *ví đủ* / *ví không đủ → CTA "Nạp thêm" + gợi ý nguồn khác* / *bank không hỗ trợ*.

---

## 7. Note riêng cho feature

- **Reuse DS, đừng dựng lại**: `AmountDisplay` (mặc định đã đúng: blue + `đ` dark-100 +
  cursor) · `NumericKeyboard` size `large` · `Sheet` variant `tray` (xác nhận/bỏ chọn) ·
  `Dialog` (lỗi/bảo trì) · `Button`.
- **Card người nhận** (dùng ở cả màn input, sheet xác nhận, result): border `1.5px`
  `--color-other-stroke2`, radius `12`, padding `12`, gap `12`, logo box `44` chứa symbol
  `36`; tên `16/20` `--color-primary-dark`, STK `14/18` `--color-variant-dark-300`.
- **Nút secondary trong sheet** = nền `--color-variant-blue-25`, **không viền**, radius `8`.
  DS `Button` chưa có variant này (2.0 = trắng+viền; 3.0 = blue-25 nhưng pill) → override
  nền qua `className`. **Gap DS đã biết.**
- **Giá trị Figma-exact không có token** (giữ nguyên, đã flag): keypad bg
  `rgba(245,249,255,0.65)` · dialog shadow `0 2px 6px rgba(0,31,62,.15)` · spacing `2/6/24/48px`.
- Dữ liệu người nhận mẫu trong repo dùng **bank symbol có thật** (Vietcombank, HDBank) —
  repo **không có** Techcombank/TPBank như Figma; đây là data demo, không phải yêu cầu design.

## 8. Component · Icon custom riêng

**Component**
| Tên | Ở đâu | Vai trò |
|---|---|---|
| `Dialog` | DS (`globalComponent/Dialog`) | modal canh giữa cho edge-case (thêm mới cho feature này) |
| `StatusContent` | `src/localComponent/StatusContent` | illustration 120 + title + message + actions; dùng chung cho dialog lỗi & màn bảo trì |

**Icon (zlp-icons — tên main-component khớp Figma)**
| Dùng cho | File |
|---|---|
| Ngân hàng | `Second/general_bank.svg` |
| Zalopay (P2P) | `Second/general_users.svg` |
| Tiền mừng | `Second/general_salary_subtract.svg` |
| Đổi quà | `Second/general_navbar_giftbox_line.svg` |
| "Xem thêm" chevron | `Second/general_arrow_down1.svg` (mixed fill+stroke → tint cả 2) |
| Badge "?" sheet xác nhận | `Second/general_question_solid.svg` |
| ✕ của Dialog | `Second/general_close.svg` (co-located trong DS Dialog) |
| ✕ bỏ chọn người nhận | `Second/general_closecircle_solid.svg` |

**Asset app** (`assets/`): `scan-icon.svg` · `zlp-coin.svg` · `vietcombank-logo.svg` ·
`edgecase-error.svg` *(placeholder)* · `edgecase-no-internet.svg` *(placeholder)*.
Bank symbol khác: `zlp-icons/Bank/` (F88, HDBank, Lio, Nestle).

**Tint rule**: icon dịch vụ là fill-only → chỉ `[fill]:not([fill="none"])`.
`arrow_down1` là mixed → tint cả `[fill]` lẫn `[stroke]` non-none. Bank logo là
multicolor → **giữ nguyên màu**, không tint.

---

## ❓ Còn thiếu để prototype trọn flow (cần bổ sung design/quyết định)

0. **Trang Home** — entry **đã chốt**: user bấm **icon "Chuyển tiền"** ở Home → màn input.
   **Design Home chờ bổ sung**; cần khi muốn demo trọn journey từ Home.
1. **Màn đích của grid dịch vụ**: tap *Ngân hàng* → (chọn bank + nhập STK?), *Zalopay* →
   (danh bạ/tìm user?), *Tiền mừng*, *Đổi quà* → chưa có design.
2. **"Xem thêm"** → màn danh sách người nhận đầy đủ: chưa có.
3. **Scan icon / xu ở nav** → màn đích: chưa có.
4. **Box gợi ý ghi chú** (fadeIn khi focus): nội dung/gợi ý là gì — chưa có design.
5. **Quy tắc P2P vs IBFT**: dựa vào field nào của người nhận để chọn nhánh (và áp min/phí)?
6. **Model điều hướng**: dùng `ScreenStack`/`ScreenLayer` (push kiểu iOS) hay thay màn?
   Back behavior giữa input → cashier → result?
7. **`onResume` trong prototype web**: mô phỏng thế nào để demo được double-submit guard?
8. **Result page**: chỉ mới có bản IBFT success — cần bản **fail** và bản **P2P**?
9. **Loading/transition** giữa Tiếp tục → Cashier: có skeleton/spinner không?
