# Technical Notes

## Solution Architecture

### Frontend (React 19)

The frontend is a SPA built with React 19 and Vite. Pages are defined in `src/pages/` and connected via React Router. Server state (movies, bookings, seats, etc.) is managed by TanStack Query, which handles caching, refetching, and loading states.

All API calls for v2 go through Axios client (`src/api/apiClient.ts`) configured with base URL `/api/v2`. Vite proxies `/api` requests to the backend at `localhost:5001`, so the browser never makes cross-origin requests in development.

The Axios client includes a response interceptor for automatic token refresh. When a request gets a 401 response, the interceptor calls `/auth/refresh`, queues any other failing requests, and retries them once the new token arrives. Example flow:

```
1. GET /api/v2/bookings/my-bookings → 401 (access token expired)
2. Interceptor calls POST /api/v2/auth/refresh
3. Backend returns new access token cookie
4. Original request is retried automatically → 200
```

### Backend — V2 API (JWT) — `/api/v2`

The V2 API is the active development direction. It uses .NET 10 Minimal APIs with dedicated endpoint classes per domain area: `AuthEndpoints.cs`, `MovieEndpoints.cs`, `ScreeningEndpoints.cs`, `BookingEndpoints.cs`, `SeatsEndpoints.cs`, `HallEndpoint.cs`, `CloudinaryEndpoint.cs`.

**Authentication:** JWT access tokens (15 min lifetime) and refresh tokens (7 days) are stored as HTTP-only, SameSite=Strict cookies. Refresh token hashes are persisted in the `refresh_tokens` database table. Protected endpoints use the `RequireAuth()` extension method, and role checks use `RequireRole("admin")`.

**Middleware:** Each V2 endpoint group applies a named CORS policy (`"V2"`) allowing `localhost:5173` with credentials. JWT cookie authentication is handled by `UseJwtAuth()` middleware.

**Data access:** V2 uses the repository pattern with dependency injection — interfaces like `IAuthRepository`, `IMovieRepository`, `IBookingRepository` are registered via `AddScoped`/`AddSingleton` in `Server.cs` and injected into endpoint handlers by the .NET DI container. MySQL implementations use MySqlConnector. Example: `BookingRepository.CreateBooking()` uses a database transaction to validate ghost seats, insert the booking, link seats, and clean up ghosts atomically.

### Backend — V1 API (Session + ACL) — `/api/v1`

The V1 API is the legacy layer. It automatically generates CRUD endpoints for every database table using `RestApi.cs` and `DbQuery.cs`. For example, `GET /api/v1/movies?where=ageRating=7&orderby=title&limit=10` dynamically builds and executes a SQL query.

**Authentication:** Session-based. A UUID session cookie maps to a JSON blob in the `sessions` table. The `Session.Start()` middleware touches sessions on each request to keep them alive, and a background task cleans up expired sessions.

**Authorization:** The ACL system (`Acl.cs`) loads rules from the database every 60 seconds. Each rule matches a route pattern (regex), HTTP method, and user role. Whitelist rules run first, then blacklist rules. Example: a rule might allow `GET /api/v1/movies` for `visitor` but block `DELETE /api/v1/movies` for anyone except `admin`.

**Data access:** Dynamic query generation via `DbQuery.cs`. Supports `where`, `orderby`, `limit`, `offset`, and `_CONTAINS_` query parameters. No repository interfaces — queries are built and executed directly.

### API Version Switching

The frontend switches between V1 and V2 via the `VITE_API_VERSION` environment variable (set in `.env.v1` / `.env.v2`). Both APIs run simultaneously on the same backend server.

Several frontend files contain `IS_V1 = import.meta.env.VITE_API_VERSION !== 'v2'` checks that branch logic at runtime:

- `src/hooks/useHomeMovies.ts` — exports either `useHomeMoviesV1` (fetches from V1) or `useHomeMoviesV2` (uses React Query with V2 endpoint)
- `src/hooks/useMovieDetails.ts` — same pattern, with a `mapV1()` function to transform V1 response shapes into V2 interfaces
- `src/pages/HomePage.tsx` — conditionally uses router loader data (V1) vs React Query (V2), and hides the filters component in V1 mode
- `src/main.tsx` — conditionally attaches `moviesLoader` to movie routes when running in V1 mode

### External Services

- **Cloudinary** — Movie poster image upload and delivery. Backend uploads via `CloudinaryEndpoint.cs`, frontend renders via `@cloudinary/react` `AdvancedImage` component.
- **MailKit (SMTP)** — Sends email verification and password reset emails. Configured in `backend/email-config.json`.
- **Mistral AI** — AI chatbot endpoint (`AiChatRoutes.cs`) forwards messages to the `devstral-small-latest` model via `ai-api.nodehill.com`. System prompt loaded from `system-prompt.md`.

### Ghost Seat Reservation

To prevent double-booking during checkout, the system uses temporary seat locks:

1. User selects seats → `POST /api/v2/seats/reserve` creates rows in `seat_ghosts` table with a 2-minute TTL
2. Booking page shows a countdown timer
3. On confirmation → `BookingRepository.CreateBooking()` validates ghost seats still exist, creates the booking, and deletes the ghosts — all in one transaction
4. On timeout or cancellation → `POST /api/v2/seats/release` deletes the ghost rows

Other users see these ghost-locked seats as unavailable. The seat map updates via short polling (TanStack Query refetch interval), not WebSockets.

### Database (MySQL)

Tables: `users`, `movies`, `screenings`, `bookings`, `seats`, `halls`, `refresh_tokens`, `seat_ghosts`, `sessions`, `acl`.

Connected via MySqlConnector. Configuration in `backend/db-config.json`. Tables are auto-created if `createTablesIfNotExist` is true, and seeded with sample data if `seedDataIfEmpty` is true.

## Technical Debt

- **V1/V2 API coexistence** — Both API versions run simultaneously. Runtime `IS_V1` checks in `useHomeMovies.ts`, `useMovieDetails.ts`, `HomePage.tsx`, and `main.tsx` create branching logic. The V1 frontend only covers movie listing and movie details — all other features (auth, bookings, seats, screenings, filters, admin, chat) have no V1 implementation and only work with V2. This means V1 mode is effectively broken for most of the app. Migration to V2-only would remove dead code paths and simplify the codebase significantly.
- **CSRF protection gap** — JWT cookies use `SameSite=Strict` but no CSRF tokens are implemented.
- **Missing input validation** — Backend registration and password reset endpoints have `// TODO: Validate request` comments. OWASP compliance issue: registration returns 409 on duplicate email instead of 200.
- **Hardcoded Cloudinary cloud name** — `dveubqvv8` is hardcoded in 7 frontend components instead of using an environment variable.
- **Silent email failures** — Email sending errors in registration and password reset are caught and logged to console but don't inform the user.
- **No seat availability check on booking** — The backend does not verify whether a seat is already booked before creating a booking. It only checks ghost seat reservations, meaning a race condition could result in double-booked seats.
- **No explicit visitor role (V2)** — V2 treats unauthenticated users as `role === null` instead of assigning a proper `visitor` role. This should be implemented to match V1's ACL model where `visitor` is an explicit role.
- **Hardcoded localhost** in CORS policy (`Server.cs`)

## Work Planned but Not Completed

### Stub Pages (UI exists, no implementation)
| Page | Route | Status |
|------|-------|--------|
| My Tickets | `/my-tickets` | Renders `<UnderDevelopment>` placeholder |
| Offers | `/offers` | Renders `<UnderDevelopment>` placeholder |
| About | `/about` | Renders `<UnderDevelopment>` placeholder |

### Social Login
- Login page shows Facebook, Google, and Apple buttons linking to `/social-login`
- Route renders `<UnderDevelopment>` component
- No OAuth backend endpoints or provider configuration exists

### Admin Panel (partial)
**Implemented:** Add movies, upload posters (Cloudinary), create screenings. Maybe separate it better on the fronted(ideally, create a separate app )

**Not implemented:**
- Edit/delete existing movies and screenings
- View/manage all bookings
- User management
- Analytics or reporting
- Pricing and discount management

### Reservation Logic Improvement
The 2-minute reservation timer is too short — it should be increased. Currently the user is kicked off the booking page when the reservation expires. Instead, the user should stay on the page with their selected seats and be allowed to attempt booking even after expiry. If another user has booked or reserved one of those seats in the meantime, the backend should return an error and the frontend should show a message that the booking failed.

### My Reservations Page
A dedicated page for users to view their active seat reservations (ghost seats) is not yet implemented.

### V1 Frontend Completeness
The V1 frontend only covers movie listing and movie details. The remaining features (auth, bookings, seats, screenings, filters, admin, chat) should be implemented for V1 or V1 should be fully deprecated.

### V1 Backend Completeness
The V1 API auto-generates CRUD endpoints per database table, but the raw table structure doesn't match what the frontend needs. MySQL views should be created to join and shape data for the missing V1 frontend services (e.g. screenings with movie and hall info, bookings with seats and pricing, user booking history). This would let the V1 auto-CRUD serve the same data the V2 dedicated endpoints provide.

### Backend TODOs
- Request payload validation for registration and password reset endpoints
- OWASP-compliant response for duplicate email registration (should return 200 instead of 409)
- Email failure notification to users (currently silent)
