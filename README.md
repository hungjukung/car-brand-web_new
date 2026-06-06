# AutoDB — 台灣汽車規格資料庫

> Next.js 15 + FastAPI + PostgreSQL + Redis + Elasticsearch

---

## 快速啟動（Docker Compose）

### 前置需求
- Docker Desktop（Windows）
- Node.js 20+（僅前端開發時需要）
- Python 3.12+（僅後端開發時需要）

### 一鍵啟動全部服務

```bash
# 複製設定檔
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 啟動所有服務（第一次較慢）
docker compose up --build

# 背景執行
docker compose up -d --build
```

服務啟動後：
- 前端：http://localhost:3000
- 後端 API：http://localhost:8000
- API 文件（Swagger）：http://localhost:8000/docs
- Elasticsearch：http://localhost:9200

### 寫入種子資料

```bash
# 方法一：進入 backend container
docker compose exec backend python seed_data.py

# 方法二：本地執行（需先 pip install -r requirements.txt）
cd backend
python seed_data.py
```

---

## 本地開發（不用 Docker）

### Backend

```bash
cd backend

# 建立虛擬環境
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

# 設定環境變數（修改 .env 中的連線資訊）
cp .env.example .env

# 啟動（確保 PostgreSQL / Redis 已在本地運行）
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install

cp .env.local.example .env.local
# 確認 NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

---

## 專案結構

```
期末2/
├── docker-compose.yml          # 所有服務編排
├── backend/                    # FastAPI Python 後端
│   ├── main.py                 # 應用程式入口
│   ├── requirements.txt
│   ├── seed_data.py            # 種子資料
│   └── api/
│       ├── core/               # 設定、資料庫、Redis、ES
│       ├── models/             # SQLAlchemy ORM 模型
│       ├── schemas/            # Pydantic 驗證 Schema
│       ├── routers/            # API 路由
│       │   ├── cars.py         # 車款 CRUD
│       │   ├── search.py       # 搜尋
│       │   ├── compare.py      # 比較
│       │   ├── tools.py        # 計算工具
│       │   └── auth.py         # 認證
│       └── services/           # 業務邏輯
└── frontend/                   # Next.js 15 前端
    ├── app/
    │   ├── page.tsx            # 首頁
    │   ├── cars/               # 車款列表 & 詳情
    │   │   └── [brand]/[model]/
    │   ├── compare/            # 車款比較
    │   ├── community/          # 社群
    │   └── tools/              # 計算工具
    ├── components/
    │   ├── ui/                 # 基礎 UI 元件
    │   ├── cars/               # 車款專用元件
    │   └── layout/             # Header / Footer
    └── lib/
        ├── api.ts              # API 客戶端
        ├── types.ts            # TypeScript 型別
        └── utils.ts
```

---

## API 端點

| Method | 路徑 | 說明 |
|--------|------|------|
| GET | `/api/v1/cars` | 車款列表（支援篩選分頁） |
| GET | `/api/v1/cars/brands` | 品牌列表 |
| GET | `/api/v1/cars/{brand}` | 品牌下所有車款 |
| GET | `/api/v1/cars/{brand}/{model}` | 車款詳細規格 |
| GET | `/api/v1/search?q=關鍵字` | 全文搜尋 |
| GET | `/api/v1/compare?ids=1&ids=2` | 比較車款 |
| POST | `/api/v1/tools/fuel-calculator` | 油耗計算 |
| POST | `/api/v1/tools/loan-calculator` | 貸款計算 |
| POST | `/api/v1/auth/register` | 會員註冊 |
| POST | `/api/v1/auth/token` | 登入取得 JWT |

---

## 開發路線圖

| Phase | 功能 | 狀態 |
|-------|------|------|
| Phase 1 | 車款資料庫、搜尋、規格頁面、計算工具 | ✅ 完成 |
| Phase 2 | 車款比較、車主評價、進階篩選 | 🚧 進行中 |
| Phase 3 | 會員系統、討論區、車庫功能 | ⏳ 規劃中 |
| Phase 4 | AI 推薦、以圖搜車、行動 App | ⏳ 規劃中 |

---

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | Next.js 15 (App Router) |
| 前端語言 | TypeScript |
| UI 元件 | shadcn/ui + Tailwind CSS |
| 動畫 | Framer Motion |
| 後端框架 | FastAPI |
| 後端語言 | Python 3.12 |
| 主資料庫 | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 (async) |
| 快取 | Redis 7 |
| 全文搜尋 | Elasticsearch 8 |
| 容器化 | Docker Compose |
