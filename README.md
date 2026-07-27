# Eventify — Events Website & Admin Dashboard

A public events website with a protected admin dashboard, built with **Vue 3 (Composition API + TypeScript)**, **Tailwind CSS**, **Pinia**, and **Vue Router**, integrated against the real **Events Assessment API** at `https://dana-test-project.lahn.sa/api/v1` (Swagger docs: `https://dana-test-project.lahn.sa/api-docs/`).

---

## Table of contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Build](#build)
- [Authentication Flow](#authentication-flow)
- [Project Structure](#project-structure)
- [API Reference (as integrated)](#api-reference-as-integrated)
- [Features Completed](#features-completed)
- [Bonus Features Implemented](#bonus-features-implemented)
- [Decisions and Assumptions](#decisions-and-assumptions)
- [Known Limitations](#known-limitations)
- [Libraries Used](#libraries-used)
- [Testing](#testing)

---

## Project Overview

Eventify has two parts, sharing one Vue app and one API layer:

1. **Public Events Website** — a home page (header, hero, events grid, footer), a published-events list backed by the API with loading/empty/error states, and an event details page (looked up by slug).
2. **Admin Dashboard** — a login-protected area to manage events: list with search/filter/pagination, create, edit, and delete (with confirmation), including image upload with a live preview.

Design goals: clean UI, obvious loading/empty/error states, no dead ends, and code that's easy to follow and extend.

## Technologies Used

- **Vue 3** (`<script setup>`, Composition API) + **TypeScript**
- **Vite** — dev server & build tool
- **Tailwind CSS** — utility-first styling, custom brand theme, class-based dark mode
- **Vue Router 4** — routing + navigation guards
- **Pinia** — state management (auth, events, theme, toast notifications)
- **Axios** — HTTP client, centralized in a single API client with interceptors
- **Vitest** + **@vue/test-utils** — unit/component tests

## Installation

```bash
git clone https://github.com/DanaGarout/events-app.git
cd events-app
npm install
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Value used here |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Events Assessment API (includes the `/api/v1` prefix) | `https://dana-test-project.lahn.sa/api/v1` |

`.env` is git-ignored. Never commit real credentials — only `.env.example` is committed.

## Running the Project

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). The app talks directly to the live API at `VITE_API_BASE_URL` — no local backend needed.

## Build

```bash
npm run build     # type-checks with vue-tsc, then builds to /dist
npm run preview   # preview the production build locally
```

## Authentication Flow

1. `POST /auth/login` with `{ email, password }` returns `{ success, message, data: { accessToken, tokenType, expiresIn, expiresAt, user } }`. The API fixes the token's lifetime at 1 hour; we use the exact `expiresAt` timestamp when present (falling back to `expiresIn` seconds) so client-side expiry tracking matches the server precisely.
2. The token is stored in **`sessionStorage`** (see `src/utils/tokenStorage.ts` for the full write-up of why sessionStorage was chosen over `localStorage`/in-memory, and the residual XSS risk that's inherent to any JS-readable storage — the safest alternative, an HttpOnly cookie, would require backend support this API doesn't offer).
3. Every request goes through one Axios instance (`src/api/apiClient.ts`), whose **request interceptor** attaches `Authorization: Bearer <token>` and proactively rejects if the token is already expired client-side (avoiding an unnecessary round trip).
4. The **response interceptor** unwraps the API's `{ success, message, data }` envelope on success, and on failure normalizes every error into one shape. On a `401` it clears the session and dispatches a `window` `CustomEvent`. `App.vue` listens for that event once, globally, and redirects to `/login` with a `redirect` query param — this keeps the API layer fully decoupled from the router/store (no circular imports).
5. Protected routes (`/dashboard/*`) are guarded in `src/router/index.ts`: opening one directly while logged out (or after expiry) redirects straight to `/login`.
6. `Logout` clears the token + user from `sessionStorage` and best-effort calls `POST /auth/logout` (the API is stateless, per its own docs — the client discarding the token is what actually "logs out").

## Project Structure

```
src/
  api/          # apiClient.ts (axios + interceptors + envelope unwrapping), authApi.ts, eventsApi.ts
  components/   # common/, events/, layout/, home/, dashboard/ — presentational + small stateful components
  composables/  # useNotify.ts (toast wrapper)
  layouts/      # PublicLayout, AuthLayout, DashboardLayout
  router/       # route table + auth guard
  stores/       # Pinia: auth.ts, events.ts, theme.ts, toast.ts
  test/         # Vitest setup
  types/        # shared TS types (event, auth, api) — mirror the OpenAPI schema exactly
  utils/        # tokenStorage, validators, formatters, errorMessages, debounce
  views/        # route-level pages (public/, auth/, dashboard/)
```
## API Reference (as integrated)

Pulled directly from `https://dana-test-project.lahn.sa/api-docs.json` (OpenAPI 3.0.3, "Events Assessment API"):

| Method | Path | Used for |
|---|---|---|
| GET | `/public/events` | Public events list (always `status=published`) — `page`, `limit`, `search`, `featured`, `date_from`, `date_to`, `sort_by`, `sort_order` |
| GET | `/public/events/:slug` | Public event details |
| POST | `/auth/login` | Admin login |
| GET | `/auth/me` | Current authenticated user (available, not currently called on every load) |
| POST | `/auth/logout` | Best-effort logout (API is stateless) |
| GET | `/admin/events` | Dashboard events list — same filters plus `status` |
| GET | `/admin/events/:id` | Load a single event to prefill the edit form |
| POST | `/admin/events` | Create event (`multipart/form-data`) |
| PATCH | `/admin/events/:id` | Update event, partial fields (`multipart/form-data`) |
| PATCH | `/admin/events/:id/status` | Quick status-only change (wired in `eventsApi.ts`, not yet exposed in the UI) |
| DELETE | `/admin/events/:id` | Soft-delete an event |
| POST | `/admin/events/:id/restore` | Restore a soft-deleted event (wired in `eventsApi.ts`, not yet exposed in the UI) |

Event fields (snake_case, exactly as the API returns them): `id`, `title`, `slug`, `short_description`, `description`, `event_date`, `start_time`, `end_time`, `location`, `status` (`draft` | `published` | `cancelled` | `completed`), `is_featured`, `image_url`, `created_at`, `updated_at`.

## Features Completed

- Home page with header, hero, events grid, footer
- Events list from the API with **loading**, **empty**, and **error + retry** states
- Event details page (image, title, full description, date/time, location, status, featured badge)
- Login page with client-side validation, loading state, and friendly error messages
- Access token stored and attached to every authenticated request; 1-hour expiry handled with an automatic redirect to login
- Protected dashboard routes (direct URL access redirects to login)
- Dashboard: events list (table on desktop / cards on mobile), create, edit, delete-with-confirmation
- Create/Edit form: client + server-side validation, loading state, guarded against double submission, success/error messaging, "feature this event" toggle
- Image upload with client-side type/size validation and preview
- Fully responsive (mobile / tablet / desktop), no horizontal scroll
- README, `.env.example`, organized source code, clear run instructions

## Bonus Features Implemented

- ✅ Edit event
- ✅ Delete event with confirmation dialog
- ✅ Pagination
- ✅ Search
- ✅ Filtering (by status, admin only — matches the API)
- ✅ Image preview
- ✅ Toast notifications (self-built with Pinia + Teleport — no extra dependency)
- ✅ Skeleton loading
- ✅ Unit tests (Vitest + @vue/test-utils)
- ✅ TypeScript
- ✅ Dark mode
- ✅ Accessibility improvements (focus-visible rings, aria-labels/aria-live on errors, keyboard-dismissible modal, semantic landmarks)

## Decisions and Assumptions

- **Public vs. admin listing**: the public site never sends a `status` filter (the API's `/public/events` endpoint always returns published events only); the status filter is admin-only, matching the documented query parameters exactly.
- **Public routing uses `slug`, admin routing uses `id`**: `GET /public/events/:slug` powers `/events/:slug` on the public site, while the dashboard's edit/delete/status actions use the numeric `id` from `/admin/events`.
- **Single event response shape**: the OpenAPI spec doesn't include a worked example for `GET /public/events/:slug` or `GET /admin/events/:id`, only a description. We assumed it follows the same `{ success, message, data: <event> }` envelope used everywhere else in the API — consistent with every other endpoint that does have an example.
- **Soft delete**: `DELETE /admin/events/:id` is documented as a soft-delete, and the API also exposes `POST /admin/events/:id/restore`. The delete confirmation dialog's copy reflects this ("removed from the public site", not "permanently deleted"). Restore isn't wired into the UI yet — it's a one-line addition in `eventsApi.ts` if needed.
- **Create/Edit form** always submits `multipart/form-data` (even without a new image) to keep one consistent code path, matching the documented content type for both endpoints.
- **Token expiry**: the login response includes both `expiresIn` (seconds) and `expiresAt` (absolute timestamp) — we prefer `expiresAt` since it's exact regardless of any delay between the server generating the response and the client reading it.
- **Dark mode** preference is stored in `localStorage` (a UI preference, not a secret) and defaults to the OS-level preference on first visit.
- A single Axios instance is the *only* place that talks to the network — no component ever calls `axios`/`fetch` directly.

## Known Limitations

- No refresh-token flow (not part of the documented API; the token simply expires after 1 hour and the user is asked to log in again).
- `PATCH /admin/events/:id/status` and `POST /admin/events/:id/restore` are implemented in `eventsApi.ts` but not yet exposed as UI actions (e.g. a quick status dropdown, or an "Undo delete" toast) — kept out to control scope, easy to add.
- No live deployment — the project is meant to be run locally following the steps above.
- No automated end-to-end (browser) tests — only unit/component tests.

## Libraries Used

| Library | Why |
|---|---|
| `vue`, `vue-router`, `pinia` | Core framework, routing, state |
| `axios` | HTTP client with interceptor support |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `vitest`, `@vue/test-utils`, `jsdom` | Unit/component testing (bonus) |

No UI/component kit was used — all components are hand-built with Tailwind to keep the bundle small and the design fully custom. Toast notifications are also self-built (Pinia + Teleport) rather than pulling in a third-party toast library.

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

Covers the token storage utility, form validators, the events API service layer, the auth store, the event creation form, and the router's auth guard (36 tests).