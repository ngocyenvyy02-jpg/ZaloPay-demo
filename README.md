# ZaloPay Transfer Money Prototype

Prototype màn hình chuyển tiền và nhận xu, sử dụng shared ZaloPay design system.

## Chạy local

```bash
npm ci
npm run dev
```

Mở `http://localhost:5173/?screen=transfer-money`.

## Build

```bash
npm run build
```

Build output nằm tại `apps/transfer-money/dist`.

## Deploy Vercel

Import repository, chọn branch `agent/transfer-money-figma` và giữ Root Directory ở repository root. `vercel.json` đã cấu hình build/output cho workspace `apps/transfer-money`.
