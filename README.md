# ZaloPay — Quét QR chuyển khoản / Tích xu đổi siêu quà (UI Demo)

Bản demo React dựng lại giao diện mobile từ file Figma (node `16-2461`). Chỉ là UI tĩnh, không có logic nghiệp vụ.

## Xem nhanh (không cần cài gì)

Mở file `dist/index.html` trực tiếp bằng trình duyệt (đã build sẵn, dùng đường dẫn tương đối nên chạy được qua `file://`).

## Chạy dev server

Máy cần cài [Node.js](https://nodejs.org) (khuyến nghị bản LTS ≥ 18). Sau đó:

```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # build lại vào dist/
```

## Cấu trúc

```
src/
├── App.jsx                    # Ghép các section theo đúng thứ tự design
├── styles.css                 # Toàn bộ style, design tokens ở :root
├── assets/                    # Ảnh cắt từ Figma (hero, hộp mù, sản phẩm, icon…)
└── components/
    ├── StatusBar.jsx          # Thanh trạng thái iOS (9:41, sóng, wifi, pin)
    ├── Icons.jsx              # SVG icons: đồng hồ, mắt, khung QR, nút đóng
    ├── MysteryBoxCard.jsx     # Card "Hộp Mù" — 2 version chuyển bằng tab, kèm chú thích nhận xét bên trái mockup
    │                          #   Version 1: bám sát design gốc, shimmer giới hạn vùng hộp (không chạm CTA)
    │                          #   Version 2: "Săn quà Hè Năng Động" — hộp nảy so le (chính), shimmer nút CTA (phụ),
    │                          #   viền tĩnh, hộp trái ẩn số xu bằng blur, hộp phải có badge "Đủ xu để mở".
    │                          #   Tôn trọng prefers-reduced-motion: tắt animation khi user bật Reduce Motion.
    ├── GiftGrid.jsx           # Lưới "Quà độc quyền Cửa hàng QR" (8 sản phẩm)
    ├── EarnCoins.jsx          # "Kiếm xu mở hộp" — carousel ngang 3 thẻ
    ├── Features.jsx           # "Tính năng đề xuất" — 4 icon
    └── Offers.jsx             # "Ưu đãi đang diễn ra"
```

## Ghi chú

- Màu và font lấy theo variables trong Figma: navy `#001F3E`, xanh chủ đạo `#0033C9`, xanh lá `#00A655`, cam `#FF8D00`; font SF Pro Display (fallback system font).
- Trên desktop, giao diện hiển thị trong khung mockup điện thoại (bezel + notch + home indicator), màn hình 375×812px, nội dung cuộn bên trong. Trên màn hình ≤ 430px khung tự ẩn, app chiếm toàn màn hình như native.
- Icon thẻ "Mở tài khoản trả sau" (thẻ thứ 3, bị che một phần trong design) dùng lại icon thẻ 1 vì Figma không xuất được icon đầy đủ.
