# Option 1 — Animation spec ("xu bay xuống CTA")

> Ảnh chụp animation hiện tại của Option 1 (reward tag → coin-fly → CTA).
> Số liệu lấy trực tiếp từ code; sửa code thì cập nhật lại file này.

## Flow (3 giai đoạn)

**S0 (nghỉ)** → _tap_ → **S2 (giao xu cho nút)** → _first coin lands_ → **count-up** → _coins finish_ → user bấm **Tiếp tục** → màn success (xu mới thật sự cộng).

Guardrail: mọi bước trước success chỉ dùng **vàng/navy**; badge vẫn giữ copy còn một bước thanh toán — **không** ✓ xanh / confetti (dành riêng màn success).

## Hằng số & nguồn

| Tham số | Giá trị | Nguồn |
|---|---|---|
| Delay bắn xu sau tap (`LAUNCH_MS`) | `0ms` | `RewardTagFlyToCta.tsx` |
| Co pill + fade-through text S0↔S2 | pill `450ms` ease-out; text enter `420ms`, exit `260ms` | `RewardTagFlyToCta.module.css` (`.root`, `.copy`) |
| Số xu bay (`COINS`) | `6` | `CoinFly.tsx` |
| Thời lượng bay mỗi xu (`FLY_MS`) | `700ms` | `CoinFly.tsx` |
| So le giữa các xu (`STAGGER_MS`) | `55ms` | `CoinFly.tsx` |
| Easing xu bay | `cubic-bezier(0.45, 0, 0.75, 0.35)` (ease-in) | `CoinFly.module.css` (`coin-fly`) |
| CTA text transition | `short-slide-down` adapted to X-axis: enter `520ms`, exit `320ms` | `TransferMoney.module.css` (`.ctaText*`) |
| CTA count-up | Bắt đầu khi coin đầu chạm CTA (~`700ms`), `0 → reward` trong `400ms` (mặc định `30.000`) | `TransferMoney.tsx` + `useCountUp` |
| Điều phối (đo vị trí, first-land, `onDone`) | — | `TransferMoney.tsx` + `CoinFly.tsx` |

## Timeline (mốc t = lúc chạm)

| t | Việc xảy ra | Chuyển động / timing |
|---|---|---|
| **0ms** | Chạm badge S0 | Nhấn `scale(0.99)` khi giữ · **haptic selection** · state S0→S2 · banner co width về `36px` (hình tròn) trong `450ms`, opacity giảm ở `360–450ms`; slot vẫn giữ để đo origin coin-fly |
| **0–450ms** | Pill co lại | Container pill transition `width` về kích thước text S2 với `450ms ease-out` |
| **0–740ms** | Text fade-through | Text S0 fade-out `260ms` (kèm `translateY(-4px)`), chờ micro-delay `60ms`, rồi text S2 fade-in `420ms` từ `opacity: 0`, `translateY(6px)`, `scale(0.99)`, `blur(2px)` về trạng thái rõ nét |
| **0ms** | CTA bắn xu | Label mặc định **"Tiếp tục"** giữ nguyên vị trí khi tap; chưa chạy text transition và amount chưa hiện · **haptic rigid** |
| **0 → ~975ms** | 6 xu bay | Mỗi xu 700ms, **so le 55ms** (xu#0 bắt đầu 0ms → xu#5 bắt đầu 275ms, đáp khoảng 975ms) |
| **~700ms** | Xu đầu chạm CTA | Chữ **"Tiếp tục"** move sang trái, text **"Tiếp tục"** settle từ phải; đồng thời hiện **`+0 🪙`** và cho cụm amount settle từ trái sang phải; ngay lúc đó kích hoạt count-up `0 → +{reward}` trong `400ms`; các xu còn lại tiếp tục bay |
| **~1030ms** | Xu cuối đáp nút (`onDone` = mount + `700 + 6×55` = 1030ms) | Gỡ overlay xu · CTA giữ **"Tiếp tục +{reward} 🪙"**, không pulse |
| sau đó | Bấm Tiếp tục | → màn success |

## Chuyển động của xu (từng đồng)

Đường đi 3 chặng, easing ease-in (tăng tốc rơi xuống như trọng lực):

- **0% → bung ra**: xuất phát tâm badge, `scale 0.7`, opacity 0.
- **~12% (~84ms) → nhô lên**: nảy lên `−20…−30px` + **xoè ngang** (6 đồng lệch `−30, −18, −6, +6, +18, +30px`), `scale 1`, opacity 1 → tạo vòng cung + chùm toả.
- **12% → 100%**: rơi tăng tốc xuống tâm nút (Δy ≈ +380px, tuỳ layout — đo runtime).
- **100% → đáp**: co lại `scale 0.5` + mờ dần opacity→0 (như "hút" vào nút). Có drop-shadow cho chiều sâu.

Xu ở rìa (lệch ngang nhiều) nhô cao hơn xu ở giữa (`lift = −18 − |spread|×0.4`) → chùm xoè tự nhiên, không phẳng.

## Haptic

- **Tap**: `playHapticSelection` (nhẹ).
- **Lúc bắn xu (0ms, cùng phase pill shrink + text fade-through)**: `playHapticRigid` (chắc hơn) — điểm nhấn "phần thưởng bung ra".

## Reduced-motion (`prefers-reduced-motion`)

Không bay, không co pill, không fade-through text: tap → CTA đổi nhãn ngay thành **"Tiếp tục +{reward} 🪙"**, count snap thẳng tới reward, badge đổi text tĩnh. Giữ đúng story, chỉ bỏ chuyển động.

## Tổng thời gian

- Từ chạm đến nút ổn định ≈ **2.7s**.
- Đoạn "hút mắt" chính (xu bay + count-up) ≈ **0–1.1s**.

---

**Điểm dễ tinh chỉnh**: số xu (`COINS`), thời lượng bay (`FLY_MS`), độ so le (`STAGGER_MS`), thời lượng co pill (`450ms`), duration fade-through enter/exit (`420ms`/`260ms`), CTA short-slide-down X enter/exit (`520ms`/`320ms`), thời điểm count (first coin `700ms`), CTA count-up (`400ms`), micro-delay (`60ms`), delay bắn (`LAUNCH_MS`).
