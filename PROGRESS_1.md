📋 Полная техническая документация проекта “Hookah App”
🎯 Описание проекта
Hookah App — это Telegram Mini App (Web App) для кальянной, позволяющее:

Просматривать каталог табаков и брендов
Создавать собственные миксы из нескольких вкусов
Лайкать/дизлайкать миксы других пользователей
Заказывать миксы на столик
Вести профиль с историей действий

🏗️ Архитектура системы
┌─────────────────────────────────────────────────────────────────┐
│                         TELEGRAM                                 │
│                    @defo_awards_bot                              │
│                                                                  │
│  Пользователь нажимает кнопку → открывается Web App             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              │ Webhook (HTTPS POST)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RENDER.COM                                  │
│                   (Backend Server)                               │
│                                                                  │
│  URL: https://hookah-app.onrender.com                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Express.js API Server                                   │    │
│  │  • POST /webhook/telegram — Telegram Bot webhook        │    │
│  │  • GET  /api/brands — список брендов                    │    │
│  │  • GET  /api/flavors — список вкусов                    │    │
│  │  • GET  /api/mixes — список миксов                      │    │
│  │  • POST /api/mixes — создание микса                     │    │
│  │  • POST /api/mixes/:id/action — лайк/заказ              │    │
│  │  • GET  /api/tags — теги вкусов                         │    │
│  │  • GET  /api/users/:id — данные пользователя            │    │
│  │  • GET  /api/users/:id/actions — действия пользователя  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ Prisma ORM                        │
│                              ▼                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               │ PostgreSQL Connection
                               │ (SSL Required)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAILWAY.APP                                 │
│                   (PostgreSQL Database)                          │
│                                                                  │
│  Host: autorack.proxy.rlwy.net:port                             │
│  Database: railway                                               │
│                                                                  │
│  Таблицы:                                                        │
│  • User — пользователи Telegram                                 │
│  • Brand — бренды табака                                        │
│  • Flavor — вкусы табака                                        │
│  • Mix — пользовательские миксы                                 │
│  • MixIngredient — ингредиенты микса                            │
│  • UserAction — действия (лайки, заказы)                        │
└─────────────────────────────────────────────────────────────────┘

                              +

┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL.COM                                  │
│                   (Frontend Server)                              │
│                                                                  │
│  URL: https://hookah-app-chi.vercel.app                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React SPA (Single Page Application)                     │    │
│  │  • Telegram Web App SDK интеграция                      │    │
│  │  • Роутинг через React Router                           │    │
│  │  • API запросы к Render backend                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

📁 Структура проекта (Monorepo)
hookah-app/
│
├── 📁 prisma/                          # Prisma ORM конфигурация
│   ├── schema.prisma                   # Схема базы данных
│   ├── seed.js                         # Сидер начальных данных
│   └── 📁 migrations/                  # Миграции БД
│
├── 📁 frontend/                        # React приложение (Vercel)
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── index.js               # API клиент (axios)
│   │   ├── 📁 components/
│   │   │   ├── BrandCard.jsx          # Карточка бренда
│   │   │   ├── FlavorCard.jsx         # Карточка вкуса
│   │   │   ├── MixCard.jsx            # Карточка микса
│   │   │   ├── Layout.jsx             # Основной layout
│   │   │   ├── Navbar.jsx             # Нижняя навигация
│   │   │   ├── Loader.jsx             # Индикатор загрузки
│   │   │   ├── SearchBar.jsx          # Поле поиска
│   │   │   └── TagFilter.jsx          # Фильтр по тегам
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx               # Главная страница
│   │   │   ├── Flavors.jsx            # Список вкусов
│   │   │   ├── FlavorDetail.jsx       # Детали вкуса
│   │   │   ├── Mixes.jsx              # Список миксов
│   │   │   ├── MixDetail.jsx          # Детали микса
│   │   │   ├── CreateMix.jsx          # Создание микса
│   │   │   └── Profile.jsx            # Профиль пользователя
│   │   ├── 📁 hooks/
│   │   │   └── useTelegram.js         # Хук для Telegram Web App API
│   │   ├── 📁 context/
│   │   │   └── TelegramContext.jsx    # React Context для Telegram
│   │   ├── 📁 utils/
│   │   │   └── helpers.js             # Вспомогательные функции
│   │   ├── App.jsx                    # Корневой компонент
│   │   ├── main.jsx                   # Entry point
│   │   └── index.css                  # Глобальные стили + Tailwind
│   ├── index.html                     # HTML шаблон + TG SDK
│   ├── .env                           # Переменные окружения
│   ├── vite.config.js                 # Vite конфигурация
│   ├── tailwind.config.js             # Tailwind конфигурация
│   ├── postcss.config.js              # PostCSS конфигурация
│   └── package.json                   # Зависимости frontend
│
├── index.js                           # Express сервер + Bot (Render)
├── .env                               # Переменные окружения backend
├── package.json                       # Зависимости backend
├── .gitignore                         # Git ignore
└── README.md                          # Документация

🔧 Технологический стек
Backend (Render.com)
Технология	Версия	Назначение
Node.js	18.x+	Runtime
Express.js	^4.18.2	HTTP сервер, API роутинг
Prisma	^5.x	ORM для PostgreSQL
@prisma/client	^5.x	Prisma клиент
node-telegram-bot-api	^0.64.0	Telegram Bot API
cors	^2.8.5	CORS middleware
dotenv	^16.3.1	Переменные окружения

Frontend (Vercel.com)
Технология	Версия	Назначение
React	^18.2.0	UI библиотека
Vite	^5.x	Build tool
React Router DOM	^6.x	Клиентский роутинг
@tanstack/react-query	^5.x	Кеширование API
Axios	^1.6.x	HTTP клиент
Tailwind CSS	^3.x	CSS фреймворк
Lucide React	^0.x	Иконки
PostCSS	^8.x	CSS процессор
Autoprefixer	^10.x	CSS автопрефиксы

Database (Railway.app)
Технология	Версия	Назначение
PostgreSQL	15.x	Реляционная БД

Telegram
Технология	Версия	Назначение
Telegram Web App SDK	6.x	Интеграция с Telegram
Telegram Bot API	Latest	Бот функциональность

📊 Схема базы данных (Prisma Schema)
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Пользователь Telegram
model User {
  id            Int          @id @default(autoincrement())
  telegramId    BigInt       @unique
  username      String?
  firstName     String?
  lastName      String?
  languageCode  String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  mixes         Mix[]        // Созданные миксы
  actions       UserAction[] // Действия пользователя
}

// Бренд табака
model Brand {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  slug        String    @unique
  logo        String?
  description String?
  country     String?
  createdAt   DateTime  @default(now())
  
  flavors     Flavor[]  // Вкусы бренда
}

// Вкус табака
model Flavor {
  id            Int              @id @default(autoincrement())
  name          String
  brandId       Int
  brand         Brand            @relation(fields: [brandId], references: [id])
  description   String?
  strength      Strength         @default(MEDIUM)
  flavorProfile FlavorTag[]      // Теги вкуса (ENUM массив)
  isPopular     Boolean          @default(false)
  createdAt     DateTime         @default(now())
  
  mixIngredients MixIngredient[] // В каких миксах используется
  
  @@unique([name, brandId])
}

// Пользовательский микс
model Mix {
  id          Int              @id @default(autoincrement())
  name        String
  description String?
  authorId    Int
  author      User             @relation(fields: [authorId], references: [id])
  userStrength Strength        @default(MEDIUM)
  isPublic    Boolean          @default(true)
  likesCount  Int              @default(0)
  dislikesCount Int            @default(0)
  ordersCount Int              @default(0)
  rating      Float            @default(0)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  
  ingredients MixIngredient[]  // Ингредиенты микса
  actions     UserAction[]     // Действия с миксом
}

// Ингредиент микса (связь Mix <-> Flavor)
model MixIngredient {
  id         Int     @id @default(autoincrement())
  mixId      Int
  mix        Mix     @relation(fields: [mixId], references: [id], onDelete: Cascade)
  flavorId   Int
  flavor     Flavor  @relation(fields: [flavorId], references: [id])
  percentage Int     // Процент в миксе (сумма всех = 100)
  
  @@unique([mixId, flavorId])
}

// Действие пользователя
model UserAction {
  id          Int        @id @default(autoincrement())
  userId      Int
  user        User       @relation(fields: [userId], references: [id])
  mixId       Int
  mix         Mix        @relation(fields: [mixId], references: [id])
  type        ActionType
  tableNumber Int?       // Номер столика (для заказов)
  rating      Int?       // Оценка 1-5
  createdAt   DateTime   @default(now())
  
  @@unique([userId, mixId, type]) // Один лайк/дизлайк на микс
}

// ENUMS

enum Strength {
  LIGHT
  MEDIUM
  STRONG
}

enum FlavorTag {
  SWEET
  SOUR
  FRESH
  FRUITY
  BERRY
  CITRUS
  MINT
  ICE
  TROPICAL
  CREAMY
  DESSERT
  SPICY
}

enum ActionType {
  LIKE
  DISLIKE
  ORDER
  FAVORITE
}

🌐 API Endpoints
Base URL: https://hookah-app.onrender.com
Brands
Method	Endpoint	Описание
GET	/api/brands	Список всех брендов с количеством вкусов
GET	/api/brands/:slug	Бренд по slug с его вкусами

Flavors
Method	Endpoint	Query Params	Описание
GET	/api/flavors	brandId, tag, search	Список вкусов с фильтрацией
GET	/api/flavors/:id	—	Детали вкуса

Mixes
Method	Endpoint	Query/Body	Описание
GET	/api/mixes	sort=popular|new|rating	Список миксов
GET	/api/mixes/:id	—	Детали микса
POST	/api/mixes	{name, description, authorId, strength, ingredients}	Создать микс
POST	/api/mixes/:id/action	{userId, type, tableNumber?, rating?}	Лайк/заказ

Tags
Method	Endpoint	Описание
GET	/api/tags	Список всех тегов

Users
Method	Endpoint	Описание
GET	/api/users/:telegramId	Данные пользователя
GET	/api/users/:telegramId/actions	История действий

System
Method	Endpoint	Описание
GET	/	Проверка работы API
GET	/api/stats	Статистика БД
POST	/webhook/telegram	Telegram webhook

🔐 Переменные окружения
Backend (.env на Render)
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:PASSWORD@autorack.proxy.rlwy.net:PORT/railway"

# Telegram Bot
BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"

# URLs
WEBAPP_URL="https://hookah-app-chi.vercel.app"
RENDER_EXTERNAL_URL="https://hookah-app.onrender.com"

# Environment
NODE_ENV="production"
PORT=3000
Frontend (.env в Vercel)
VITE_API_URL="https://hookah-app.onrender.com"

🤖 Telegram Bot команды
Команда	Описание
/start	Приветствие + кнопка открытия Web App
/menu	Открыть меню (Web App)
/help	Справка
/test	Проверка работы бота
/stats	Статистика (бренды, вкусы, миксы)

🚀 Деплой конфигурации
Render.com (Backend)
Build Command: npm install && npx prisma generate && npx prisma db push
Start Command: node index.js
Environment: Node
Region: Oregon (US West)
Instance Type: Free
Auto-Deploy: Yes (from GitHub main branch)

Vercel.com (Frontend)
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x

Railway.app (Database)
Service: PostgreSQL
Region: US West

📦 Package.json файлы
Backend (корневой package.json)
{
  "name": "hookah-app",
  "version": "1.0.0",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "db:push": "prisma db push",
    "db:seed": "node prisma/seed.js",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.x",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "node-telegram-bot-api": "^0.64.0"
  },
  "devDependencies": {
    "prisma": "^5.x"
  }
}

Frontend (frontend/package.json)
{
  "name": "hookah-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "axios": "^1.6.x",
    "lucide-react": "^0.x",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x"
  },
  "devDependencies": {
    "@types/react": "^18.2.x",
    "@types/react-dom": "^18.2.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "tailwindcss": "^3.x",
    "vite": "^5.x"
  }
}

🎨 Дизайн система
Цветовая палитра (Tailwind)
// tailwind.config.js
colors: {
  hookah: {
    primary: '#10B981',    // Зелёный (Emerald)
    secondary: '#6366F1',  // Фиолетовый (Indigo)
    accent: '#F59E0B',     // Оранжевый (Amber)
    dark: '#111827',       // Тёмный фон
    card: '#1F2937',       // Фон карточек
  }
}

Telegram Theme Variables
:root {
  --tg-theme-bg-color: #1a1a1a;
  --tg-theme-text-color: #ffffff;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #64B5F6;
  --tg-theme-button-color: #50a8eb;
  --tg-theme-button-text-color: #ffffff;
  --tg-theme-secondary-bg-color: #2a2a2a;
}

✅ Что реализовано
Backend
 Express API сервер
 Prisma ORM с PostgreSQL
 CRUD для брендов, вкусов, миксов
 Telegram Bot с webhook
 Система лайков/дизлайков
 Система заказов на столик
 Seed данные (3 бренда, 15 вкусов)
Frontend
 React SPA с Vite
 Tailwind CSS стилизация
 Telegram Web App SDK интеграция
 Навигация (Home, Flavors, Mixes, Profile)
 Просмотр брендов и вкусов
 Просмотр миксов с сортировкой
 Создание микса (3 шага)
 Детальные страницы
 Адаптивный мобильный дизайн
Инфраструктура
 GitHub репозиторий
 Render деплой (backend)
 Vercel деплой (frontend)
 Railway PostgreSQL
 Telegram Bot webhook
 CORS настройка
 Environment variables
❌ Что НЕ реализовано (TODO)
Функционал
 Авторизация/аутентификация Telegram InitData
 Валидация Telegram WebApp данных на сервере
 Рейтинговая система (1-5 звёзд)
 Комментарии к миксам
 Избранное (FAVORITE)
 Поиск по миксам
 Уведомления о заказах (админу)
 Админ-панель
 Загрузка изображений
 Кеширование (Redis)
Улучшения
 Оптимистичные обновления UI
 Infinite scroll / пагинация
 Pull-to-refresh
 Offline режим
 PWA функционал
 Анимации (Framer Motion)
 Тесты (Jest, Cypress)
 Error boundary
 Логирование (Winston)
 Rate limiting
Telegram Bot
 Inline режим
 Уведомления о новых миксах
 Рассылка
 Многоязычность

🔗 URLs и доступы
Ресурс	URL/ID
Frontend	https://hookah-app-chi.vercel.app
Backend	https://hookah-app.onrender.com
Telegram Bot	@defo_awards_bot
GitHub	(ваш репозиторий)
Vercel Dashboard	https://vercel.com/dashboard
Render Dashboard	https://dashboard.render.com
Railway Dashboard	https://railway.app/dashboard

📝 Важные заметки для будущей разработки
1. Версии зависимостей
КРИТИЧНО: Используй Tailwind CSS v3.x (не v4), так как v4 имеет другой синтаксис и конфигурацию.

2. Prisma
После изменения schema.prisma:
npx prisma generate
npx prisma db push

3. Render Free Tier
Сервер засыпает после 15 минут неактивности. Для продакшена нужен платный план или внешний ping-сервис.

4. Telegram Web App
SDK подключается в index.html: <script src="https://telegram.org/js/telegram-web-app.js"></script>
Данные пользователя доступны через window.Telegram.WebApp.initDataUnsafe.user
В браузере (не в Telegram) некоторые методы не работают — нужно обрабатывать ошибки
5. CORS
Backend настроен принимать запросы с любого origin (cors() без параметров). Для продакшена рекомендуется ограничить.

6. База данных
Railway может менять порт при перезапуске. Если БД недоступна — проверь DATABASE_URL в Render.

🎯 Рекомендуемый план развития
Фаза 1: Стабилизация
Добавить валидацию Telegram InitData
Добавить error boundaries
Улучшить обработку ошибок API
Добавить loading states везде
Фаза 2: Функционал
Рейтинговая система
Комментарии
Избранное
Админ-панель
Фаза 3: Масштабирование
Кеширование (Redis)
CDN для статики
Оптимизация запросов
Мониторинг и алерты

Дата документации: Январь 2026
Версия проекта: 1.0.0
Статус: MVP готов, работает в production