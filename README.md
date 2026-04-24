# 🌿 Thuận Châu – Frontend

Hệ thống tra cứu lịch thời vụ và kỹ thuật chăm sóc cây trồng tại xã Thuận Châu, Sơn La.

---

## ⚙️ Công nghệ

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| React Router DOM | v6 | Routing |
| Axios | 1.x | HTTP client + JWT interceptor |
| Recharts | 2.x | Biểu đồ thống kê admin |
| CSS thuần + BEM | — | Styling |

---

## 🚀 Cài đặt & Chạy

### 1. Cài dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
```

Sửa `.env`:

```
VITE_API_BASE_URL=http://localhost:3000
```

> Đây là URL gốc của backend API (không có dấu `/` cuối)

### 3. Chạy development

```bash
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### 4. Build production

```bash
npm run build
npm run preview   # preview bản build
```

---

## 🗂 Cấu trúc thư mục

```
src/
├── features/                   ← Mỗi feature là module độc lập
│   ├── auth/                   ← Đăng nhập, JWT, useAuth
│   ├── plants/                 ← Danh sách, chi tiết, lịch, kỹ thuật
│   ├── categories/             ← Nhóm cây (filter)
│   ├── faqs/                   ← Hỏi & Đáp (public)
│   └── admin/
│       ├── dashboard/          ← Thống kê, biểu đồ
│       ├── plants/             ← CRUD cây trồng
│       ├── categories/         ← CRUD nhóm cây
│       ├── calendar/           ← CRUD lịch thời vụ
│       ├── careStages/         ← CRUD kỹ thuật chăm sóc
│       ├── faqs/               ← CRUD hỏi đáp
│       └── users/              ← Quản lý tài khoản
│
├── components/                 ← UI dùng chung (Button, Modal, Spinner…)
├── pages/                      ← Màn hình chính, compose features
│   └── admin/                  ← Các trang quản trị
├── layouts/                    ← MainLayout (public) + AdminLayout (sidebar)
├── context/                    ← AuthContext, ToastContext
├── utils/                      ← axiosInstance, tokenHelper, formatDate
└── router/                     ← AppRouter (tất cả route tập trung)
```

---

## 🔐 Authentication

- Đăng nhập → nhận `accessToken` + `refreshToken` → lưu `localStorage`
- Axios interceptor tự động đính `Bearer token` vào mọi request
- 401 → tự động thử refresh token → nếu thất bại → logout + redirect `/login`
- Protected routes redirect về `/login` nếu chưa đăng nhập

---

## 🌐 Routing

| Route | Loại | Mô tả |
|---|---|---|
| `/` | Public | Trang chủ |
| `/plants` | Public | Danh sách cây trồng |
| `/plants/:id` | Public | Chi tiết cây (lịch, kỹ thuật, FAQ) |
| `/calendar` | Public | Lịch thời vụ theo tháng |
| `/faqs` | Public | Hỏi & Đáp |
| `/login` | Public | Đăng nhập |
| `/admin/dashboard` | Auth | Tổng quan thống kê |
| `/admin/plants` | Auth | CRUD cây trồng |
| `/admin/categories` | Auth | CRUD nhóm cây |
| `/admin/calendar` | Auth | CRUD lịch thời vụ |
| `/admin/care-stages` | Auth | CRUD kỹ thuật chăm sóc |
| `/admin/faqs` | Auth | CRUD hỏi đáp |
| `/admin/users` | Admin only | Quản lý tài khoản |

---

## 📝 Ghi chú tự suy luận (Best Practice)

1. **Refresh token flow**: Backend chưa document rõ endpoint, tự suy luận là `POST /api/auth/refresh-token` với body `{ refreshToken }`.
2. **Lịch thời vụ admin**: `GET /admin/calendar/:plantId` — suy luận từ cấu trúc RESTful.
3. **Kỹ thuật chăm sóc admin**: `GET /admin/care-stages/:plantId` — tương tự.
4. **Activity types**: Suy luận từ field `activity_type` trong model Calendar gồm: `lam_dat`, `gieo_trong`, `cham_soc`, `phong_tru`, `thu_hoach`, `bao_quan`.
5. **Recharts** được thêm (không có trong yêu cầu ban đầu) để render biểu đồ dashboard admin thay vì SVG thủ công.
