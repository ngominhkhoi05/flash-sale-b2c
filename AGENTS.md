<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Frontend (Flash Sale B2C)

> **Source of truth** cho mọi AI agent / Cursor session làm việc trên repo `flash-sale-b2c`.
> Repo này là **Next.js 16 (App Router) frontend** consume API của `flash-sale-b2c-UTC2` (Spring Boot backend).
> Repo `deploy-b2c-utc2` chứa `docker-compose`, `nginx`, `scripts deploy`.

---

## Mục lục

1. [Project Overview](#1-project-overview)
2. [Source of Truth](#2-source-of-truth)
3. [Agent Workflow](#3-agent-workflow)
4. [Stack & Versions - Mandatory](#4-stack--versions---mandatory)
5. [Project Structure](#5-project-structure)
6. [Layer Convention](#6-layer-convention)
7. [Auth State & JWT](#7-auth-state--jwt)
8. [API Client](#8-api-client)
9. [Realtime WebSocket (STOMP + SockJS)](#9-realtime-websocket-stomp--sockjs)
10. [API Contract Mirror](#10-api-contract-mirror)
11. [Idempotency Convention](#11-idempotency-convention)
12. [Error UX](#12-error-ux)
13. [Validation & Forms](#13-validation--forms)
14. [Styling & UI](#14-styling--ui)
15. [State Management](#15-state-management)
16. [Pagination & List UX](#16-pagination--list-ux)
17. [Routing & Auth Guards](#17-routing--auth-guards)
18. [Environment Variables](#18-environment-variables)
19. [Build & Toolchain](#19-build--toolchain)
20. [Testing](#20-testing)
21. [Git Workflow](#21-git-workflow)
22. [No Premature Over-Engineering](#22-no-premature-over-engineering)
23. [Cross-Repo Layout](#23-cross-repo-layout)
24. [Task Execution Checklist](#24-task-execution-checklist)
25. [Required Final Response Format](#25-required-final-response-format)
26. [Module → Page Map](#26-module--page-map)
27. [Documentation & API Sync Checklist](#27-documentation--api-sync-checklist)

---

## 1. Project Overview

### Project

**Flash Sale B2C - Storefront (Next.js)** — UI cho hệ thống **Flash Sale B2C Multi-Vendor Marketplace** phục vụ đồ án.

### Technology Stack

- Next.js **16.3.8** (App Router, React Server Components + Client Components).
- React **19.2.x**.
- TypeScript **5.x** (`strict: true`).
- Tailwind CSS **4.x** (`@tailwindcss/postcss`).
- TanStack Query **5.x** (server state).
- React Hook Form **7.x** + Zod **3.x** (form + validation).
- `@stomp/stompjs` **7.x** + `sockjs-client` (realtime).
- `lucide-react` (icons).
- `clsx` + `tailwind-merge` (className utils).
- ESLint **9.x** + `eslint-config-next` 16.3.8.

### Brand

- Tên brand: **Vibe Mart**.
- Tông màu chính: **sky-700** (primary) + **rose-600** (flash sale / error).
- Copy mặc định: **tiếng Việt**.

### Current Development Phase

Đã hoàn thành:
1. Bootstrap Next.js + Tailwind + ESLint.
2. Auth pages (login / register / forgot-password / reset-password / verify-email).
3. Storefront home (Header / Footer / ProductCard / FlashSaleCountdown).
4. API client wrapper + React Query hooks (auth, user, products, flashsales, vouchers, categories, addresses).
5. WebSocket layer (StompClient singleton + hooks `useSlotRealtime`, `useItemRealtime`, `useActiveSlotsRealtime`).
6. Auth state (Context + localStorage).

Đang bước vào:
- Flash sale detail + reservation flow.
- Cart + Checkout (multi-vendor split).
- Profile + Address book.
- Seller portal.
- Admin portal.

---

## 2. Source of Truth

Agent phải đọc và tuân thủ (ưu tiên từ trên xuống):

1. **Code hiện tại** trong repo này (luôn là ground truth cuối cùng).
2. File `AGENTS.md` này.
3. `flash-sale-b2c-UTC2/AGENTS.md` (backend) — đặc biệt các mục về API contract, Auth, Flash Sale, WebSocket, Idempotency, Error Code.
4. `flash-sale-b2c-UTC2/docs/` — design docs, ERD, sequence diagram, API document (xem mục #10).
5. `deploy-b2c-utc2/README.md` — biết env / nginx / domain thật khi deploy.

### Quy tắc khi phát hiện mâu thuẫn

- Code ≠ `AGENTS.md` (FE) → báo user, **không tự ý sửa** `AGENTS.md`.
- Code FE ≠ backend `AGENTS.md` / `docs/` → báo user, **không tự ý sửa** docs backend.
- Phát hiện API backend khác docs → ping team backend, **không tự ý** đoán shape.

### Quy tắc `node_modules/next/dist/docs/`

- **Trước khi viết code Next.js 16**, đọc guide trong `node_modules/next/dist/docs/`.
- Tuyệt đối **không** dùng API / pattern từ training data khi có breaking change. Ví dụ Next 16 có thể đã thay đổi:
  - `cookies()` / `headers()` phải `await`.
  - Route handler signature.
  - `params` / `searchParams` (sync vs async).
  - Middleware export.
  - `Link` / `Image` props.
- Block `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` ở đầu file này do Next tự re-add — **không xóa**, mất công Next viết lại (xem comment trong block).

---

## 3. Agent Workflow

Mỗi task nên thực hiện:

1. **Understand** — đọc yêu cầu, xác định module FE, có đụng API / WS / Auth không.
2. **Inspect** — đọc code hiện tại của module + `AGENTS.md` (FE) + phần liên quan của backend `AGENTS.md`.
3. **Read relevant docs** — chỉ đọc phần docs thực sự liên quan (không dump cả file).
4. **Plan** — liệt kê file sẽ tạo/sửa, side-effect (auth state, WS subscribe, React Query cache).
5. **Implement** — đúng layer, đúng convention.
6. **Validate** — `npm run lint` (nhanh), `npm run build` (cuối).
7. **Review diff** — tự review.
8. **Report** — báo cáo theo format mục #25.

Không nhảy thẳng vào code khi task liên quan API contract, auth flow, flash sale flow hoặc cross-repo layout.

---

## 4. Stack & Versions - Mandatory

### Node / npm

- **Node 20.x LTS** hoặc **Node 22.x LTS** (khuyến nghị 22).
- `npm` 10+.
- Lockfile: `package-lock.json` (không xóa, không convert sang `pnpm` / `yarn`).

### Next.js / React

- **Next.js 16.3.8** (App Router).
- **React 19.2.x**.
- TypeScript 5.x, `strict: true` (đã cấu hình trong `tsconfig.json`).
- Path alias `@/*` → repo root (đã cấu hình).

### Tailwind

- **Tailwind 4.x** dùng `@tailwindcss/postcss`.
- KHÔNG dùng `tailwind.config.js` cũ v3 (Next 16 + Tailwind 4 dùng CSS-first config).
- Theme tokens (Material 3 system colors) đã có trong `app/globals.css` — **mở rộng tại đây**, không tạo file mới.

### Quy tắc

- **KHÔNG tự ý bump version** Next / React / Tailwind / TanStack Query — khi upgrade phải đọc breaking changes trong `node_modules/next/dist/docs/`.
- Không thêm dependency mới nếu đã có sẵn công cụ đáp ứng.
- Khi cần lib mới → báo user, list lý do, alternative đã xét.

---

## 5. Project Structure

### App Router layout

```text
app/                          # Next.js App Router
├── (store)/                  # Route group cho storefront (buyer-facing)
│   ├── flash-sales/
│   │   └── page.tsx          # Public list flash sale slots
│   ├── cart/                 # (planned) Cart
│   ├── checkout/             # (planned) Checkout
│   ├── orders/               # (planned) My orders
│   └── profile/              # (planned) User profile
├── (auth)/                   # (planned) Route group cho auth pages
├── login/page.tsx            # Public
├── register/page.tsx         # Public
├── forgot-password/page.tsx
├── reset-password/page.tsx
│   ├── expired/page.tsx
│   └── success/page.tsx
├── verify-email/page.tsx
├── forbidden/page.tsx        # 403 UI
├── maintenance/page.tsx      # Maintenance screen
├── layout.tsx                # Root layout (Geist fonts, Providers)
├── providers.tsx             # QueryClientProvider + AuthProvider
├── globals.css               # Tailwind 4 + Material 3 design tokens
├── not-found.tsx             # 404 UI
├── page.tsx                  # Storefront home
└── favicon.ico

components/
├── storefront/               # Buyer-facing shared components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── FlashSaleCountdown.tsx
└── ui/                       # Generic UI primitives
    └── VibeMartLogo.tsx

lib/
├── api/                      # API client + per-module React Query hooks
│   ├── client.ts             # apiFetch (JWT + refresh)
│   ├── auth.ts
│   ├── user.ts
│   ├── categories.ts
│   ├── products.ts
│   ├── flashsales.ts
│   ├── vouchers.ts
│   ├── addresses.ts
│   └── index.ts              # barrel
├── auth/
│   └── store.tsx             # AuthProvider + useAuth
└── realtime/
    └── flashsale-ws.ts       # StompClient + hooks (useSlotRealtime, ...)

types/
└── index.ts                  # Domain types (ProductSummary, FlashSaleSlot, Voucher, ...)

public/                       # Static assets
```

### Quy tắc

- **Không tạo** `app/api/**` (Next Route Handlers) — FE chỉ gọi backend, không proxy. Nếu cần proxy có lý do rõ → báo user.
- **Không tạo** `pages/` (Pages Router) — codebase đang dùng App Router.
- **Không tạo** `tailwind.config.js` — dùng CSS-first config trong `globals.css`.
- **Không tạo** `middleware.ts` chỉ để che logic auth — xem mục #17.

---

## 6. Layer Convention

### `lib/api/<module>.ts`

- 1 file per backend module (vd `flashsales.ts` cho `/flash-sales/*`).
- Mỗi file export:
  - Types (mirror API response).
  - `xxxApi()` plain async function (gọi `apiFetch`).
  - `useXxx()` React Query hook (`useQuery` / `useMutation`).
- **KHÔNG** chứa JSX, **KHÔNG** gọi `useAuth` ngoài `onSuccess` của mutation cần sync auth state.
- Barrel `lib/api/index.ts` re-export tất cả — page chỉ `import { useXxx } from "@/lib/api"`.

### `lib/auth/store.tsx`

- `AuthProvider` mount 1 lần trong `app/providers.tsx`.
- `useAuth()` hook — throw nếu dùng ngoài Provider.
- Persist vào `localStorage` key `vibemart.auth` (xem mục #7).
- **KHÔNG** gọi React Query ở đây (tách concerns).

### `lib/realtime/flashsale-ws.ts`

- Singleton `StompClient` (qua `getClient()`).
- Hooks: `useSlotRealtime`, `useItemRealtime`, `useActiveSlotsRealtime` (xem mục #9).
- **KHÔNG** gọi trực tiếp `localStorage` ngoài `getToken()`.

### `components/`

- `storefront/*` — component gắn với domain (ProductCard, Header, FlashSaleCountdown). Có thể là Client Component (`"use client"`).
- `ui/*` — primitive không biết domain (Button, Input, Modal, Logo). **Không** fetch data ở đây.
- Không tạo `hooks/` riêng lẻ — hooks theo module nằm trong `lib/api` hoặc `lib/realtime`.

### `app/<route>/page.tsx`

- Có thể là Server Component (default) hoặc Client Component.
- Server Component → gọi API backend trực tiếp (qua `fetch` server-side, có thể dùng `NEXT_PUBLIC_API_BASE` hoặc `INTERNAL_API_BASE` nếu có).
- Client Component → dùng React Query hooks.
- Nếu cần cả 2: tách `page.tsx` (server, nhận initial data) + `ComponentName.tsx` (client, consume props + React Query).

### Quy tắc chung

- Một component = một concern.
- **Không** gọi `fetch` trực tiếp trong component — luôn qua `lib/api`.
- **Không** hard-code URL backend — luôn qua `process.env.NEXT_PUBLIC_API_BASE` hoặc `NEXT_PUBLIC_WS_BASE`.

---

## 7. Auth State & JWT

### Token model

- Backend cấp `accessToken` + `refreshToken` qua `POST /api/v1/auth/login` (xem backend `AGENTS.md` #46.3).
- FE lưu cả 2 trong `localStorage` dưới key `vibemart.auth`:

  ```json
  {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { "id": 1, "email": "...", ... }
  }
  ```

- Đọc / ghi qua helper `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens` trong `lib/api/client.ts` (đã có).

### Lifecycle

```text
1. Login / Register success → saveToStorage + setTokensInStorage + setState
2. Mỗi apiFetch → đọc accessToken từ localStorage, gắn Authorization header
3. 401 từ backend → doRefresh() → POST /auth/refresh-token
   ├─ success → update tokens → retry request
   └─ fail    → clearTokens() + redirect /login
4. Logout → clearTokens() + clear state + redirect /login
```

### Quy tắc

- **KHÔNG** decode JWT trong FE để check expiry — backend trả 401 mới refresh. Tránh drift với backend clock.
- **KHÔNG** lưu password plaintext ở FE dưới mọi hình thức.
- **KHÔNG** log token ra `console.log` ở production — chỉ log trong `dev` và phải mask.
- `AuthProvider` cần thời gian hydrate từ localStorage (1 effect) → trang phụ thuộc auth nên chờ `isLoading === false` mới render (xem mục #17).
- Logout gọi `POST /api/v1/auth/logout` (fire-and-forget) rồi mới clear local state. Lỗi logout API không chặn clear local (đã làm trong `useLogout`).

### Auth pages hiện có

| Path | Module | Auth required |
|---|---|---|
| `/login` | `app/login/page.tsx` | No (redirect to `/` nếu đã login) |
| `/register` | `app/register/page.tsx` | No |
| `/forgot-password` | `app/forgot-password/page.tsx` | No |
| `/reset-password` | `app/reset-password/page.tsx` | No |
| `/reset-password/expired` | `app/reset-password/expired/page.tsx` | No |
| `/reset-password/success` | `app/reset-password/success/page.tsx` | No |
| `/verify-email` | `app/verify-email/page.tsx` | No |
| `/forbidden` | `app/forbidden/page.tsx` | No (403 UI) |

---

## 8. API Client

### `apiFetch` wrapper (xem `lib/api/client.ts`)

- Base URL: `process.env.NEXT_PUBLIC_API_BASE` (mặc định `http://localhost:8080/api/v1`).
- Auto-inject `Authorization: Bearer <accessToken>` (trừ khi `skipAuth: true`).
- Auto refresh + retry 1 lần khi 401.
- Unwrap `ApiResponse<T>` → trả `T` (throw `ApiError` nếu `success === false`).
- `toNumber()` helper — backend có thể trả `"1,000"` cho BigDecimal, ép về `number` để format tiền tệ.

### Quy tắc

- **Mọi HTTP request phải đi qua `apiFetch`** — không gọi `fetch` trực tiếp trong component / page.
- `skipAuth: true` **chỉ** dùng cho: `/auth/login`, `/auth/register`, `/auth/refresh-token`, `/auth/logout`. Tất cả endpoint khác phải có token.
- Không tự ý thêm retry ngoài flow 401 — backend đã có idempotency (mục #11) cho write endpoints, retry phải dùng `Idempotency-Key`.
- 422 (validation error) → `ApiError.message` đã chứa message tiếng Việt, hiển thị trực tiếp (mục #12).
- 403 → push đến `/forbidden`.

### React Query defaults (xem `app/providers.tsx`)

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

- `staleTime` mặc định **30s** — override per hook khi cần (vd `useProducts` 30s, `useFlashSaleSlots` 15s + `refetchInterval: 30_000`).
- `retry: 1` — không retry quá nhiều lần để tránh spam khi backend lỗi thật.
- `refetchOnWindowFocus: false` — Flash Sale không phụ thuộc vào focus, tiết kiệm request.

### Quy tắc React Query

- `queryKey` phải ổn định, dạng mảng: `["products", filter]` chứ không phải `[JSON.stringify(filter)]` (đã làm đúng trong `useProducts`).
- Mutation `onSuccess` cập nhật auth state nếu liên quan (vd `useUpdateMe` → `setUser`).
- Mutation `onSuccess` navigate qua `useRouter().push` (xem `useLogin`, `useRegister`).
- Không gọi `refetch()` trong `useEffect` nếu không cần — để React Query tự quản lý.

---

## 9. Realtime WebSocket (STOMP + SockJS)

### Stack

- `@stomp/stompjs` 7.x (Client).
- `sockjs-client` 1.x (SockJS fallback).
- Endpoint: `${NEXT_PUBLIC_WS_BASE}/ws?token=<JWT>` (xem backend `AGENTS.md` #36).

### `StompClient` singleton (xem `lib/realtime/flashsale-ws.ts`)

- Lazy connect khi hook đầu tiên subscribe.
- Topic multiplexing: nhiều callback cùng topic → share 1 STOMP subscription.
- Auto-reconnect với exponential backoff (1s → 10s, double).
- `require()` `@stomp/stompjs` + `sockjs-client` dynamic để tránh SSR crash.
- `disconnect()` khi không còn subscriber nào.

### Destinations (mirror backend `AGENTS.md` #36)

| Hook | Topic | Mục đích |
|---|---|---|
| `useItemRealtime(itemId, onStock)` | `/topic/flash-sale/item/{itemId}/stock` | Stock realtime 1 SKU |
| `useSlotRealtime(slotId, onUpdate)` | `/topic/flash-sale/slot/{slotId}/stock-update` + `/topic/flash-sale/slot/{slotId}/status` | Stock + status của 1 slot |
| `useActiveSlotsRealtime(slotIds[], onUpdate)` | Multi-slot (stock + status) | Home page subscribe slot ACTIVE |

### Payload format

Server wrap trong `ApiResponse<T>`, payload `data` là `FlashSaleWsEvent` (xem `types/index.ts`):

```ts
interface FlashSaleWsEvent {
  eventType: 'STOCK_DECREMENTED' | 'STOCK_RESTORED' | 'STOCK_RETURNED_UNSOLD' |
              'SLOT_ACTIVATED' | 'SLOT_CLOSED' |
              'ORDER_RESERVED' | 'ORDER_CANCELLED_TIMEOUT';
  slotId?, flashSaleItemId?, orderId?, userId?;
  availableStock?, allocatedStock?, quantity?, restoredQuantity?, totalAmount?;
  orderCode?, slotStatus?, expiresAt?, occurredAt: string;
}
```

### Quy tắc khi dùng WS trong UI

- **WS chỉ là notification** — không để user quyết vào / quyết định mua dựa trên WS message (vd không khóa nút "Mua" khi chưa nhận WS).
- Stock hiển thị vẫn nên re-fetch qua REST định kỳ (xem `useFlashSaleSlots` có `refetchInterval` 30s) — WS chỉ là tăng tốc realtime.
- Khi nhận `STOCK_DECREMENTED` → cập nhật local state (vd `setAvailableStock`). Không mutate lại source of truth từ WS.
- `onUpdateRef.current = onUpdate` pattern (xem hook hiện có) tránh re-subscribe mỗi lần parent re-render.
- Cleanup `unsubscribe` trong `useEffect` return.
- **KHÔNG** queue message khi offline — `SimpMessagingTemplate` backend không queue.
- **KHÔNG** subscribe trong render → chỉ trong `useEffect`.

### Per-user destinations (planned)

Khi implement `ORDER_RESERVED` / `ORDER_CANCELLED_TIMEOUT` private:

- Topic: `/user/{username}/queue/flash-sale/reservation-result` và `/user/{username}/queue/flash-sale/orders/{orderCode}/updates`.
- Cần username → lấy từ `useAuth().user.email` (backend principal dùng email).
- Test trên nhiều browser / account khác nhau để đảm bảo message đến đúng user.

---

## 10. API Contract Mirror

> Source of truth 100% là backend. Phần này chỉ là **cheat sheet** để FE tra nhanh, **không thay thế** `flash-sale-b2c-UTC2/docs/`.
> Khi backend thay đổi endpoint → cập nhật section tương ứng trong file này + file `lib/api/<module>.ts` + `types/index.ts` (xem mục #27).

### 10.1 Auth (mirror backend #46.3)

| Method | Endpoint | Request | Response `data` |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | `{ username, email, password, fullName, phoneNumber }` | `AuthSession` |
| `POST` | `/api/v1/auth/login` | `{ usernameOrEmail, password }` | `AuthSession` |
| `POST` | `/api/v1/auth/refresh-token` | `{ refreshToken }` | `{ accessToken, refreshToken }` |
| `POST` | `/api/v1/auth/logout` | (empty) | (empty) |

`AuthSession` = `{ accessToken, refreshToken, tokenType, expiresIn, user }`.

### 10.2 User (mirror backend #46.4)

- `GET /api/v1/users/me` → `UserProfile`.
- `PUT /api/v1/users/me` → update.
- `PUT /api/v1/users/me/change-password`.

### 10.3 Address (mirror backend #46.5)

- `GET /api/v1/users/addresses`.
- `POST /api/v1/users/addresses`.
- `PUT /api/v1/users/addresses/{id}`.
- `DELETE /api/v1/users/addresses/{id}`.
- `PATCH /api/v1/users/addresses/{id}/default`.

### 10.4 Store / Category / Product (mirror backend #46.6–46.8)

- Store: `GET /stores/{id}`, `POST /stores`, `GET /stores/me`, `PATCH /admin/stores/{id}/status`.
- Category: `GET /categories`, `GET /categories/{id}`.
- Product: `GET /products` (query: `categoryId`, `keyword`, `minPrice`, `maxPrice`, `page`, `size`), `GET /products/{id}`.

### 10.5 Flash Sale (mirror backend #46.10)

- `GET /api/v1/flash-sales/slots` → `FlashSaleSlot[]` (đã có `useFlashSaleSlots`).
- `POST /api/v1/flash-sales/reservations` (planned) — `Idempotency-Key` BẮT BUỘC (mục #11).

### 10.6 Cart / Order / Voucher / Payment / Wallet / Review / Image

- Cart: `GET /cart`, `POST /cart/items`, ... (planned, xem backend #46.11).
- Order: `GET /orders/me`, ... (planned, xem backend #46.12).
- Voucher: `GET /vouchers/platform`, `GET /vouchers/store/{id}` (đã có hook), `POST /vouchers` (claim).
- Payment / Wallet / Review / Image: planned, xem backend #46.14–46.16, #25.

### 10.7 Error code (mirror backend #38)

| HTTP | Code mẫu | Ý nghĩa FE |
|---|---|---|
| 400 | `*_BAD_REQUEST` | Form validation fail |
| 401 | `AUTH_INVALID_TOKEN` | Refresh fail → redirect `/login` |
| 403 | `*_ACCESS_DENIED` | Push đến `/forbidden` |
| 404 | `*_NOT_FOUND` | Empty state, không crash |
| 409 | `*_CONFLICT` / `*_ALREADY_EXISTS` | Toast "Đã tồn tại" |
| 422 | `*_UNPROCESSABLE` | Business rule fail — hiển thị message |
| 500 | `*_INTERNAL_ERROR` | Generic error, có nút "Thử lại" |

`message` trong `ApiResponse` là **tiếng Việt** — FE hiển thị nguyên xi, không tự dịch.

---

## 11. Idempotency Convention

Mirror backend #34. Khi gọi endpoint yêu cầu `Idempotency-Key` (hiện tại: **POST `/flash-sales/reservations`**):

### Client rule

- Generate `crypto.randomUUID()` cho mỗi lần user nhấn "Đặt mua" (KHÔNG reuse qua nhiều lần nhấn).
- Gắn vào header: `Idempotency-Key: <uuid>`.
- Truyền kèm `idempotencyKey` trong body nếu backend contract yêu cầu (xem `CreateReservationRequest.idempotencyKey` trong `lib/api/flashsales.ts`).
- Khi nhận 409 `IDEMPOTENCY_IN_PROGRESS` → hiển thị "Đang xử lý, vui lòng chờ..." KHÔNG retry.
- Khi nhận 422 `IDEMPOTENCY_KEY_MISMATCH` → nghĩa là body khác lần trước, generate key mới.

### Lưu ý

- Reservation key phải unique per click — KHÔNG cache key trong React state quá lâu (vd nhấn 2 lần liên tiếp → 2 key).
- Khi user back / forward page → generate key mới, KHÔNG dùng lại key cũ.

---

## 12. Error UX

### Strategy

| Loại lỗi | UX |
|---|---|
| Validation form (client-side, Zod) | Inline message dưới field, focus field đầu tiên lỗi |
| 400 từ API | Toast top-right + scroll lên top |
| 401 | Auto refresh; nếu fail → redirect `/login` (đã làm trong `apiFetch`) |
| 403 | Push đến `/forbidden` (đã có page) |
| 404 | Render empty state component (không crash) |
| 409 | Inline message trong modal/form tương ứng |
| 422 | Hiển thị `ApiError.message` từ backend (tiếng Việt) |
| 500 / network | Toast "Đã có lỗi xảy ra, vui lòng thử lại" + button "Thử lại" |
| WS disconnect | Không hiển thị banner, fallback REST polling vẫn chạy |

### Quy tắc

- **KHÔNG** hiển thị raw error object / stack trace cho user.
- **KHÔNG** dùng `alert()` trong flow chính — chỉ trong dev / demo (xem `app/verify-email/page.tsx` là tạm thời).
- **KHÔNG** show message tiếng Anh khi backend trả tiếng Việt (và ngược lại) — nhất quán tiếng Việt.
- Loading state: dùng skeleton hoặc spinner — không dùng "Loading..." text đơn thuần.
- Empty state: illustration + CTA rõ ràng.

---

## 13. Validation & Forms

### Library

- **React Hook Form 7** + **Zod 3** + `@hookform/resolvers`.
- 1 schema Zod per form → share giữa client validation và (nếu sau này cần) server action.

### Quy tắc

- Validate **trước khi submit** — không để backend trả 400 mới hiển thị.
- Error message tiếng Việt, viết trong schema Zod (`{ message: "Email không hợp lệ" }`).
- Password rule (mirror backend):
  - Tối thiểu **8 ký tự**.
  - Có chữ hoa, chữ thường, số, ký tự đặc biệt (xác nhận lại với backend khi implement).
- Phone: regex `^0[0-9]{9,10}$` (VN).
- Email: Zod `.email()`.
- Required field: dùng `.min(1)` thay vì `.nonempty()` để error message thân thiện hơn.

### Submit pattern

```ts
const onSubmit = handleSubmit(async (data) => {
  try {
    await mutation.mutateAsync(data);
    // success UX
  } catch (err) {
    if (err instanceof ApiError) {
      // hiển thị err.message
    }
  }
});
```

### Quy tắc

- Disable nút submit khi `isSubmitting` hoặc `mutation.isPending` — tránh double submit.
- Hiển thị state loading trên nút (text + spinner), không disable UI cả form.

---

## 14. Styling & UI

### Tailwind 4

- CSS-first config: theme tokens trong `app/globals.css` (đã có Material 3 system colors).
- Utility classes chuẩn Tailwind 4 syntax.
- Class merge: dùng helper `cn(...inputs)` kết hợp `clsx` + `tailwind-merge` (chưa có sẵn → tạo `lib/utils.ts` khi cần).
- **KHÔNG** viết custom CSS trong component file — chỉ Tailwind utilities.
- **KHÔNG** dùng inline `style={{...}}` trừ khi giá trị dynamic (vd `width: ${percentage}%`).

### Color palette chính (xem `app/globals.css` + `app/page.tsx`)

| Token | Tailwind class | Dùng cho |
|---|---|---|
| Primary | `sky-700` / `sky-800` / `sky-900` | Button chính, link, brand |
| Accent | `rose-600` | Flash Sale, error, sale badge |
| Success | `emerald-600` | Success state, freeship badge |
| Warning | `amber-300` / `amber-700` | Countdown, voucher nổi bật |
| Neutral | `slate-50` → `slate-900` | Background, text |

### Typography

- Font: `Geist` (sans + mono) đã setup trong `app/layout.tsx`.
- Heading: `font-black` / `font-extrabold`.
- Body: `text-xs` / `text-sm` (chú ý: codebase đang dùng size nhỏ cho compact, có thể bump lên `text-sm` / `text-base` cho accessibility).

### Icons

- `lucide-react` — import named: `import { ShoppingBag } from "lucide-react"`.
- KHÔNG mix icon library khác.

### Quy tắc component

- Mỗi component có 1 layout chuẩn (vd Card có `rounded-xl border bg-white p-3`).
- Mobile-first: mặc định mobile, dùng `sm:` / `md:` / `lg:` để scale up.
- `loading="lazy"` cho `<img>` KHÔNG phải `<Image>` của Next (xem mục #22 — chưa quyết định dùng `next/image`).
- Accessibility: button phải có `aria-label` nếu chỉ có icon, form input phải có `<label>`.

---

## 15. State Management

### Phân chia

| Loại state | Tool | Ví dụ |
|---|---|---|
| Server state | **TanStack Query** | products, slots, user profile |
| Auth state | **React Context** (`useAuth`) | current user, tokens |
| Realtime cache | **Local state** (`useState`) + WS hook | availableStock từ WS |
| UI ephemeral | **Local state** (`useState` / `useReducer`) | modal open, form draft |
| URL state | **`useSearchParams`** + `useRouter` | filter, pagination, sort |
| Persisted user pref | `localStorage` (qua `lib/auth/store.tsx`) | auth tokens + user |

### Quy tắc

- **KHÔNG** thêm Redux / Zustand / Jotai nếu React Query + Context đủ.
- **KHÔNG** sync React Query cache vào localStorage trừ khi cần offline mode (chưa cần).
- URL là source of truth cho filter / pagination (vd `/products?categoryId=3&page=2`) — share link reproduce được.
- Khi update auth state từ mutation (`useUpdateMe`) → dùng `setUser` từ `useAuth` để đồng bộ.

---

## 16. Pagination & List UX

### Mirror backend pagination

- `PageResponse<T>` = `{ items, pageNumber, pageSize, totalElements, totalPages, isFirst, isLast, hasNext, hasPrevious }`.
- Default `page=0`, `size=20`, `MAX_PAGE_SIZE=100` (xem backend #29).
- Sort mặc định `createdAt DESC`.

### Quy tắc

- **KHÔNG** load toàn bộ list rồi phân trang client-side — gọi API theo `page` / `size`.
- Dùng infinite scroll (TanStack Query `useInfiniteQuery`) cho feed (vd home page) — nhưng CHỈ khi backend support `cursor` hoặc `page` lớn.
- Dùng "Xem thêm" button cho product list thường.
- Hiển thị `totalElements` + range hiện tại (vd "Hiển thị 1-20 của 153 sản phẩm").
- Skeleton loading cho list (không spinner toàn page).

---

## 17. Routing & Auth Guards

### Quy tắc

- **KHÔNG** dùng `middleware.ts` để check auth cho mọi route — chỉ dùng khi cần redirect ở edge (vd rewrite subdomain). Lý do: token nằm trong `localStorage` không đọc được ở edge.
- Auth guard thực hiện ở **component level** (vd `app/(store)/orders/page.tsx` check `useAuth().isAuthenticated`).

### Pattern đề xuất

```tsx
"use client";

import { useAuth } from "@/lib/auth/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <PageSkeleton />;
  if (!isAuthenticated) return null;

  return <OrdersContent />;
}
```

### Role-based guard (planned)

- Sau khi có role từ `AuthSession.user.roles`:
  - `BUYER` → `/` và `/flash-sales`.
  - `SELLER` → `/seller/*` (planned).
  - `ADMIN` → `/admin/*` (planned).
- Tạo hook `useRequireRole(role: Role)` ở `lib/auth/store.tsx` (planned).
- 403 → push `/forbidden` (đã có page).

### Public routes

- `/`, `/products`, `/products/[id]`, `/flash-sales`, `/flash-sales/[id]`, `/categories`, `/stores/[id]`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/forbidden`.
- Tất cả khác → require auth (vd `/cart`, `/checkout`, `/orders`, `/profile`).

---

## 18. Environment Variables

### Required cho dev

```env
# Backend REST API base
NEXT_PUBLIC_API_BASE=http://localhost:8080/api/v1

# Backend WebSocket base (KHÔNG có /api/v1)
NEXT_PUBLIC_WS_BASE=http://localhost:8080
```

### Quy tắc

- **Mọi biến FE đọc được ở client phải prefix `NEXT_PUBLIC_`**.
- **KHÔNG** commit `.env.local` (đã có trong `.gitignore`).
- Commit `.env.example` (chưa có → tạo khi cần, mirror `.env.local` không có value nhạy cảm).
- **KHÔNG** hard-code URL backend trong code — luôn `process.env.NEXT_PUBLIC_API_BASE`.
- Khi deploy qua repo `deploy-b2c-utc2` → set env trong `docker-compose.yml` (xem `deploy-b2c-utc2/README.md`).

### Per-environment

| Env | API base (vd) |
|---|---|
| `local` | `http://localhost:8080/api/v1` |
| `staging` | `https://api.staging.flash-sale-b2c.com/api/v1` |
| `prod` | `https://api.flash-sale-b2c.com/api/v1` |

Cấu hình qua env var khi build Docker image.

---

## 19. Build & Toolchain

### Scripts (xem `package.json`)

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Workflow

```bash
# Dev
npm run dev               # next dev (port 3000 mặc định)

# Lint
npm run lint

# Build production
npm run build

# Chạy production
npm run start
```

### Quy tắc

- **KHÔNG** dùng `npm install` global — chỉ local trong repo.
- **KHÔNG** xóa `package-lock.json`.
- Khi thêm dep mới → `npm install <pkg>` (KHÔNG tự ý sửa `package.json` tay).
- Lock file conflict → chạy `npm install` lại, KHÔNG xóa lock.
- Build fail → đọc error của Next 16, **KHÔNG** dùng `--no-lint` hoặc skip để bypass.

### Next.js 16 quirks

- **Một số route cần async `params` / `searchParams`** — đọc lại `node_modules/next/dist/docs/` trước khi code dynamic route.
- **`next/image` cấu hình `remotePatterns`** cho Cloudinary domain — backend đang dùng Cloudinary (xem backend #25).
- `next.config.ts` hiện đang rỗng — khi thêm `images.remotePatterns` / `experimental.*` / `rewrites` thì khai báo ở đây.

---

## 20. Testing

### Hiện tại

- **Chưa có test framework** (chưa cài Jest / Vitest / Playwright).
- Coverage mục tiêu (khi có): **>= 60%** cho `lib/api/*` hooks và `lib/auth/store.tsx`.

### Khi thêm test

- **Unit test** cho hook: `@testing-library/react` + `msw` mock API.
- **Component test** cho UI primitive: snapshot hoặc render test.
- **E2E test**: Playwright cho flow chính (login → home → flash sale → reservation).
- **Không** test trực tiếp component có gọi `useRouter` mà chưa mock `next/navigation`.

### Quy tắc

- Mỗi bug fix có 1 reproduction trước khi fix (test hoặc manual repro).
- Mỗi hook API mới → viết test mock `apiFetch` đảm bảo unwrap đúng `ApiResponse`.

---

## 21. Git Workflow

### Branching model

```text
main       # production-ready, được bảo vệ, chỉ merge qua PR
dev        # integration branch, base cho mọi branch mới
feature/<shorter-desc>    # vd: feature/order-module, feature/flashsale-reservation
fix/<shorter-desc>        # vd: fix/auth-401-loop, fix/stock-display-bug
hotfix/<shorter-desc>     # vd: hotfix/payment-callback-timeout — sửa khẩn cấp, branch từ main, merge cả main + dev
refactor/<shorter-desc>   # vd: refactor/extract-product-card
chore/<shorter-desc>      # vd: chore/bump-react-19
docs/<shorter-desc>       # vd: docs/sync-flashsale-endpoint
```

Khi nào dùng `hotfix/` thay cho `fix/`:

- `fix/<x>` — bug thường, làm trong sprint, branch từ `dev`, merge vào `dev`.
- `hotfix/<x>` — bug **khẩn cấp** trên production, branch từ `main`, merge thẳng vào `main` rồi cherry-pick / merge ngược về `dev`.

### Quy trình BẮT BUỘC trước mỗi task

```text
1. git checkout dev
2. git pull origin dev
3. git checkout -b <type>/<shorter-desc>      # tạo nhánh mới từ dev
4. ... làm task ...
5. git add .                                   # stage toàn bộ thay đổi
6. git commit -m "<type>: <mô tả ngắn>"
7. DỪNG — KHÔNG push (xem mục "Không push" bên dưới)
```

> **Lưu ý**: Mỗi `shorter-desc` phải mô tả đúng tính năng đang làm, theo chuẩn đặt tên nhánh của doanh nghiệp. Không đặt tên chung chung kiểu `feature/new`, `fix/bug`, `chore/update`.

### Commit message

Conventional commit, tiếng Anh:

```text
feat: implement flash sale reservation flow
fix: prevent infinite loop on 401 refresh
chore: bump @tanstack/react-query to 5.105
refactor: extract useApiError toast hook
docs: sync flash sale endpoint contract
hotfix: patch payment callback signature mismatch
```

- 1 commit = 1 concern (không gộp `feat` + `fix` trong cùng commit).
- Reference issue / task ID nếu có (`feat: implement cart (#12)`).
- Commit message dùng `git commit -m` ngắn gọn, body giải thích **tại sao** nếu cần.

### Quy tắc commit & add

- Dùng `git add .` để đưa toàn bộ file đã sửa vào staging area, sau đó commit.
- KHÔNG cần (và không khuyến khích) `git add <file>` thủ công từng file.
- Commit CHỈ những gì đã thực sự thay đổi trong task hiện tại — không commit file lạ (vd file generated, file tạm).

### KHÔNG push

- Agent **TUYỆT ĐỐI KHÔNG** chạy `git push` dưới mọi hình thức (`git push`, `git push origin`, `git push -u`, `git push --force`, ...).
- Việc push lên GitHub là của **người dùng** — đây là quy tắc bắt buộc.
- Sau khi commit xong → báo cáo cho user (theo format mục #25), user tự quyết định push & tạo PR / merge theo workflow của họ.
- Nếu user yêu cầu agent push → agent **vẫn từ chối** và nhắc lại rule này, trừ khi user gỡ rule rõ ràng.

### Conflict resolution

Khi `git pull`, `git merge`, hoặc `git rebase` xảy ra conflict:

1. Agent chạy `git status` để liệt kê file bị conflict.
2. Agent **KHÔNG tự ý** resolve bằng:
   - `git checkout --theirs <path>`
   - `git checkout --ours <path>`
   - `git add <path>` trước khi user duyệt
   - Sửa nội dung file conflict mà chưa hỏi user
3. Agent **đọc từng file conflict**, tóm tắt cho user:
   - Dòng nào đang bị conflict.
   - Hai phiên bản (local vs remote) khác nhau điểm nào.
   - Hệ quả nếu giữ theirs / ours / kết hợp.
4. Agent dùng `AskQuestion` để user chọn hướng xử lý:
   - Giữ phiên bản của mình (ours).
   - Giữ phiên bản từ remote (theirs).
   - Kết hợp thủ công (agent sẽ trình bày diff để user chỉnh).
5. Sau khi user duyệt → agent mới sửa file + `git add .` + commit.

### Không commit

- `.env`, `.env.local`, `.env.production`.
- `node_modules/`, `.next/`, `out/`, `build/`.
- `*.tsbuildinfo`, `next-env.d.ts` (Next tự gen).
- IDE files `.idea/`, `.vscode/`.
- `*.log`.

### PR

- 1 PR = 1 concern.
- Mô tả: thay đổi gì, tại sao, screenshot/video nếu có UI change.
- Nếu thay đổi API contract → link tới backend PR.
- Nếu có breaking change UI → ghi rõ.

---

## 22. No Premature Over-Engineering

Không tự ý thêm:

- `next/image` optimization (chưa cần nếu ảnh từ Cloudinary đã optimize).
- PWA / service worker.
- i18n (chỉ tiếng Việt, đa ngôn ngữ sau).
- Dark mode toggle UI (đã có CSS variables, bật sau).
- Storybook (chỉ khi UI primitive đã ổn định).
- E2E test infrastructure (chỉ khi manual test không đủ).
- Route handlers proxy (`app/api/**`).
- Saga / state machine cho form (chỉ khi form phức tạp thật sự).

Mục tiêu: Flash Sale B2C storefront có UI rõ ràng, đúng nghiệp vụ, dùng được trong scope đồ án.

---

## 23. Cross-Repo Layout

Workspace có 3 repo:

| Repo | Path | Vai trò |
|---|---|---|
| `flash-sale-b2c-UTC2` | `d:\flash-sale-b2c-UTC2` | **Spring Boot backend** |
| `flash-sale-b2c` | `d:\flash-sale-b2c` (repo này) | **Next.js frontend** |
| `deploy-b2c-utc2` | `d:\deploy-b2c-utc2` | **docker-compose, nginx, scripts deploy** |

### Quy tắc

- Repo này **chỉ chứa** FE code (Next.js + TS + Tailwind).
- **KHÔNG** sửa code backend từ repo này.
- **KHÔNG** sửa `docker-compose.yml` / `nginx` từ repo này (đã có repo `deploy-b2c-utc2`).
- Nếu cần đổi API contract → ping team backend, **KHÔNG** tự sửa backend từ FE repo.
- Khi cần thay đổi deploy config (env var, port, domain) → sửa `deploy-b2c-utc2`, copy `.env.example` từ repo đó.

### Sync với backend

- Khi backend merge endpoint mới → cập nhật section tương ứng trong file này (mục #10) + `lib/api/<module>.ts` + `types/index.ts`.
- Khi backend thay đổi WS destination / event type → cập nhật `lib/realtime/flashsale-ws.ts` + `types/index.ts` + section #9.
- Tham khảo **Migration Impact Matrix** trong backend `AGENTS.md` #48 cho biết thay đổi nào ảnh hưởng tới FE.

---

## 24. Task Execution Checklist

### Understanding
- [ ] Đã đọc yêu cầu, xác định module FE và layer.
- [ ] Đã đọc `AGENTS.md` này (FE) — đặc biệt section liên quan.
- [ ] Đã đọc phần `AGENTS.md` backend liên quan (vd khi làm flash sale → đọc backend #13–#19, #46.10).
- [ ] Đã đọc `node_modules/next/dist/docs/` cho API Next 16 liên quan.
- [ ] Đã kiểm tra code hiện tại (không chỉ tin docs).

### Implementation
- [ ] Đúng layer (`lib/api/*`, `components/*`, `app/*`).
- [ ] Không gọi `fetch` trực tiếp trong component — qua `apiFetch`.
- [ ] Không hard-code URL — qua env var.
- [ ] Không hard-code token / secret.
- [ ] Component có `"use client"` khi cần hooks / state / event handler.
- [ ] Nếu cần WS → qua hook trong `lib/realtime/flashsale-ws.ts` (không subscribe trực tiếp Stomp).
- [ ] Nếu cần idempotency → theo mục #11.
- [ ] Error handling theo mục #12.

### Auth
- [ ] Auth guard đúng (mục #17).
- [ ] `isLoading === true` → render skeleton, KHÔNG redirect vội.
- [ ] 401 → đã có flow trong `apiFetch` (auto refresh + redirect /login).
- [ ] 403 → redirect `/forbidden`.

### API / WS contract
- [ ] Đã grep `types/index.ts` xem type đã có chưa.
- [ ] Đã grep `lib/api/<module>.ts` xem hook đã có chưa.
- [ ] Nếu thêm endpoint mới → update mục #10 trong file này.
- [ ] Nếu thêm WS event → update `types/index.ts` + mục #9.

### Styling
- [ ] Tailwind utilities, không custom CSS trong component.
- [ ] Màu sắc theo palette (mục #14).
- [ ] Mobile-first, `loading="lazy"` cho `<img>`.

### Build/Test
- [ ] `npm run lint` pass.
- [ ] `npm run build` pass.
- [ ] Smoke test: mở `/`, `/login`, `/flash-sales` xem 200 OK.

### Documentation Sync
- [ ] Nếu thêm endpoint → update mục #10.
- [ ] Nếu đổi WS → update mục #9.
- [ ] Nếu thêm page → update mục #26.

---

## 25. Required Final Response Format

Sau khi hoàn thành task:

```text
## Changes
- ...

## Implementation
- ...

## API / WS
- (nếu có)

## Tests
- Build: `npm run build` → pass / fail
- Lint: `npm run lint` → pass / fail
- Manual smoke: trang nào đã mở, status

## Notes
- ...
```

Nếu có lỗi:

```text
## Issues
- ...
```

### Quy tắc báo cáo

- **Không tuyên bố** "perfect", "100% safe", "guaranteed".
- Phải mô tả đúng phạm vi đã kiểm tra, kết quả test và limitation còn lại.
- Nếu có thay đổi ảnh hưởng API contract → ghi rõ cần sync team backend.

---

## 26. Module → Page Map

> Single source of truth cho việc map giữa backend module và FE page. Cập nhật khi thêm / sửa page.

### Buyer storefront

| Backend module | FE page (planned / done) | Component chính | Hook chính |
|---|---|---|---|
| `auth` | `/login` ✅, `/register` ✅, `/forgot-password` ✅, `/reset-password` ✅, `/verify-email` ✅ | `app/login/page.tsx` | `useLogin`, `useRegister` |
| `user` | `/profile` (planned) | — | `useMe`, `useUpdateMe` |
| `user` (address) | `/profile/addresses` (planned) | — | `useMyAddresses`, `useCreateAddress`, ... |
| `category` | (inline trên home) ✅ | `app/page.tsx` | `useCategories` |
| `product` | `/products` (planned), `/products/[id]` (planned) | — | `useProducts`, `useProductDetail` |
| `store` | `/stores/[id]` (planned) | — | — |
| `flashsale` (public) | `/` (home, có slot active) ✅, `/flash-sales` (planned) | `ProductCard`, `FlashSaleCountdown` | `useFlashSaleSlots` + `useActiveSlotsRealtime` |
| `flashsale` (reservation) | `/flash-sales/[itemId]` (planned) | — | `useCreateReservation` |
| `cart` | `/cart` (planned) | — | — |
| `order` | `/orders` (planned), `/orders/[code]` (planned) | — | — |
| `voucher` | (inline trên home) ✅ | `app/page.tsx` | `usePlatformVouchers` |
| `payment` | `/orders/[code]/pay` (planned) | — | — |
| `wallet` | `/wallet` (planned) | — | — |
| `review` | `/products/[id]?tab=reviews` (planned) | — | — |
| `image` | (qua cloudinary URL trong ProductSummary) ✅ | — | — |

### Seller (planned)

| Backend module | FE page | Hook chính |
|---|---|---|
| `store` | `/seller/store` | `useMyStore`, `useUpdateStore` |
| `store` (address) | `/seller/addresses` | `useMyStoreAddresses` |
| `product` (seller) | `/seller/products`, `/seller/products/[id]` | `useMyProducts`, ... |
| `flashsale` (seller) | `/seller/flash-sale-items` | `useMyFlashSaleItems` |
| `voucher` (seller) | `/seller/vouchers` | `useMyStoreVouchers` |
| `order` (seller) | `/seller/orders` | — |

### Admin (planned)

| Backend module | FE page | Hook chính |
|---|---|---|
| `flashsale` (admin) | `/admin/flash-sales/slots` | — |
| `store` (admin) | `/admin/stores` | — |
| `category` (admin) | `/admin/categories` | — |
| `voucher` (admin) | `/admin/vouchers` | — |

### Shared components

| Component | Dùng ở đâu | Hook realtime |
|---|---|---|
| `Header` | mọi storefront page | — |
| `Footer` | mọi storefront page | — |
| `ProductCard` | home, product list, flash sale list | `useItemRealtime` |
| `FlashSaleCountdown` | home, flash sale list | (client-side timer) |

---

## 27. Documentation & API Sync Checklist

### 27.1 Nguyên tắc

Code, API contract, WS contract **PHẢI đồng bộ**. Mỗi thay đổi endpoint hoặc WS destination phải kéo theo cập nhật:

1. `lib/api/<module>.ts` (hook + type).
2. `types/index.ts` (nếu type mới / đổi).
3. Mục #10 trong file này (nếu endpoint mới / đổi).
4. Mục #9 trong file này (nếu WS destination / event type đổi).
5. Mục #26 nếu thêm page mới.

### 27.2 Khi nào sync

| Trigger | Phải sync |
|---|---|
| Backend thêm endpoint mới | `lib/api/<module>.ts` + `types/index.ts` + mục #10 |
| Backend đổi response shape | `types/index.ts` + hook + mục #10 |
| Backend đổi status enum / error code | mục #10.7 + error UX (mục #12) |
| Backend thêm WS event | `types/index.ts` + `lib/realtime/flashsale-ws.ts` + mục #9 |
| Backend thêm role mới | `lib/auth/store.tsx` + mục #17 + mục #7 |
| Thêm page mới | mục #26 + header/nav nếu cần |

### 27.3 Khi phát hiện FE ≠ backend

- **Backend = source of truth** cho API contract.
- Báo user (team backend) bằng note rõ ràng (file, dòng, mong đợi vs thực tế).
- **KHÔNG tự ý** patch code FE để khớp với code backend chưa được duyệt.
- Nếu backend đã merge + cập nhật `AGENTS.md` backend → mới sửa FE.

### 27.4 Khi thay đổi breaking UI / API

- Bump version API (`/api/v2/...`) nếu backend hỗ trợ.
- Giữ endpoint cũ 1 release cycle.
- Ghi rõ trong PR body FE + ping team backend.

---

> **Ghi chú cuối**: File này là **living document**. Cập nhật khi:
> - Thêm module FE mới.
> - Thay đổi API contract (mirror backend).
> - Thêm page mới.
> - Thay đổi WS event.
>
> **Không tự ý sửa** khi phát hiện sai — báo user trước.
