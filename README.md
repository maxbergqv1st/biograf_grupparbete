# Filmvisarna

**Filmvisarna** (The Film Watchers) is a full-stack cinema booking web application where users can browse movies, view screenings, select seats, and book tickets.

## Team

| Name | GitHub |
|------|--------|
| Ivan | [@ikolokoltsev](https://github.com/ikolokoltsev) |
| David | [@NonSentientExistence](https://github.com/NonSentientExistence) |
| Marcus | [@Marcusjk9](https://github.com/Marcusjk9) / [@marcusHome9](https://github.com/marcusHome9) |
| Dusan | [@DusanTodo](https://github.com/DusanTodo) |
| Max Bergqvist | [@maxbergqv1st](https://github.com/maxbergqv1st) / [@MaxBergqvist](https://github.com/MaxBergqvist) |
| Lukas | [@smilefaceea](https://github.com/smilefaceea) |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Vite, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, React Router, TanStack Query, i18next, Storybook(visual testing) |
| **Backend** | .NET 10 Minimal API, JWT authentication, Cloudinary, MailKit |
| **Database** | MySQL |
| **Tooling** | ESLint, Prettier, Orval (API models generation) |

## Features

- **Movie browsing** — filter by genre, age rating, date, and free-text search
- **Movie details** — view trailer, cast, director, and available screenings
- **Seat selection** — interactive seat map with real-time availability(implemented via short pulling)
- **Ticket booking** — price categories for adults, children, and seniors
- **Authentication** — register, login, email verification, password reset (JWT-based, should be CSRF)
- **Booking management** — view active tickets, booking history, and cancel bookings
- **Admin panel** — manage movies, screenings, and upload posters via Cloudinary(under development)
- **AI chatbot** — built-in chat assistant for movie-related queries
- **Multi-language** — Swedish and English (i18next)
- **Responsive design** — optimized views for mobile and desktop

## Project Structure

```
├-- src/                        # Frontend (React)
│   |-- pages/                  # Page components (19 pages)
│   ├-- components/             # UI components (shadcn/ui + custom)
│   ├-- api/                    # API client, hooks, services, generated types
│   ├-- locales/                # i18n translation files (sv, en)
│   ├-- config/                 # Navigation and app constants
│   ├-- interfaces/             # TypeScript interfaces
│   └-- utils/                  # Helper functions
├-- backend/                    # Backend (.NET 10)
│   └-- src/
│       ├-- Auth/               # JWT authentication & token management
│       ├-- Movies/             # Movie endpoints & repository
│       ├-- Screening/          # Screening management
│       ├-- Booking/            # Booking endpoints & repository
│       ├-- Seats/              # Seat selection & availability
│       ├-- Halls/              # Cinema hall management
│       ├-- Cloudinary/         # Image upload service
│       ├-- Email/              # Email service (MailKit)
│       ├-- AiChatRoutes.cs     # AI chatbot endpoint
│       ├-- RestApi.cs          # V1 dynamic REST API
│       └-- App.cs              # Application entry point
├-- public/                     # Static assets
└-- .storybook/                 # Storybook configuration
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/), node can be an option, but bun is recommended
- [.NET 10 SDK](https://dotnet.microsoft.com/download)

### Installation

1. Copy the database config template and fill in your credentials:
   ```bash
   cp backend/db-config.template.json backend/db-config.json
   ```

2. Edit `backend/db-config.json` with the correct values for DB and AI chat:
   ```json
   {
     "host": "...",
     "port": 4567,
     "username": "...",
     "password": "...",
     "database": "...",
     "createTablesIfNotExist": true,
     "seedDataIfEmpty": true,
     "aiAccessToken": "..."
   }
   ```
   - `createTablesIfNotExist` — automatically creates database tables on startup
   - `seedDataIfEmpty` — populates tables with sample data if empty
   - `aiAccessToken` — API key for the AI chatbot (Mistral/Devstral via nodehill)

3. Create `backend/auth-config.json` for JWT authentication:
   ```json
   {
     "secret": "your-jwt-secret-key",
     "accessTokenLifetimeMinutes": 15,
     "refreshTokenLifetimeMinutes": 10080,
     "issuer": "filmvisarna"
   }
   ```

4. Create `backend/email-config.json` for SMTP email service:
   ```json
   {
     "smtpHost": "smtp.gmail.com",
     "smtpPort": 587,
     "senderEmail": "your-email@gmail.com",
     "senderName": "Filmvisarna",
     "appPassword": "your-app-password",
     "frontendUrl": "http://localhost:5173"
   }
   ```

5. Create `backend/.env` for Cloudinary image uploads:
   ```
   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```

6. Create frontend env files `.env.v1` and `.env.v2`:
   ```
   VITE_API_VERSION=v1   # or v2
   ```

7. Install dependencies:
   ```bash
   bun install
   ```

## Running the Project

| Command | Description |
|---------|-------------|
| `bun run dev` | Run frontend + backend (V1 API) |
| `bun run dev:v2` | Run frontend + backend (V2 API with JWT) |
| `bun run dev:fe` | Frontend only v1 |
| `bun run dev:be` | Backend only v1 |
| `bun run build` | Build for production |
| `bun run storybook` | Launch Storybook (port 6006) |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |
| `bun run api:generate` | Generate API types from backend (Orval) |

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001
- **Swagger docs:** http://localhost:5001/swagger (development only)

### V1 — `/api/v1`
Session and ACL-based dynamic REST API. Automatically generates CRUD endpoints for all database tables. Supports query parameters: `where`, `orderby`, `limit`, `offset`. See [README-V1.md](README-V1.md) for V1 documentation.

### V2 — `/api/v2`
JWT-based API with dedicated endpoints:

| Area | Endpoints |
|------|-----------|
| **Auth** | Login, register, refresh token, logout, verify email, password reset |
| **Movies** | List with filters, movie details |
| **Screenings** | Screening info, screenings by movie |
| **Bookings** | Create, cancel, get user bookings |
| **Seats** | Hall layout, seat availability, reserve/release |
| **Chat** | AI chatbot endpoint |
| **Cloudinary** | Image upload |

## Admin Access

The following accounts with admin privileges are available (seeded via `seedDataIfEmpty`):

| Login | Password |
|-------|----------|
| `admin` | `admin` |
| `erik.andersson@email.se` | `password123` |
