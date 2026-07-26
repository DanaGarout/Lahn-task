# Lahn-task
Events website with a protected admin dashboard, built with Vue 3, TypeScript, and Tailwind CSS. Integrates with a live REST API for browsing, creating, and managing events.
# Eventify — Events Website & Admin Dashboard

A public events website with a protected admin dashboard, built with Vue 3 (Composition API + TypeScript), Tailwind CSS, Pinia, and Vue Router.

## Tech Stack
- Vue 3 (script setup, Composition API) + TypeScript
- Vite — dev server & build tool
- Tailwind CSS — utility-first styling, dark mode
- Pinia — state management
- Vue Router 4 — routing + navigation guards
- Axios — HTTP client
- Vitest + @vue/test-utils — testing

## Project Structure (so far)
src/types/  — Shared TypeScript types mirroring the real API schema (event, auth, api)
src/utils/  — tokenStorage, validators, formatters, errorMessages, debounce

## API Integration

Talks to the real Events Assessment API at https://dana-test-project.lahn.sa/api/v1
(Swagger: https://dana-test-project.lahn.sa/api-docs/)

Key endpoints: GET /public/events, GET /public/events/:slug, POST /auth/login,
GET /auth/me, POST /auth/logout, GET /admin/events, GET /admin/events/:id,
POST /admin/events, PATCH /admin/events/:id, PATCH /admin/events/:id/status,
DELETE /admin/events/:id, POST /admin/events/:id/restore

## Environment Variables

Copy .env.example to .env and set VITE_API_BASE_URL.

## Authentication Flow

1. POST /auth/login returns an access token (1-hour expiry) and the user's profile.
2. The token is stored in sessionStorage (see src/utils/tokenStorage.ts for the reasoning).
3. Every request automatically attaches Authorization: Bearer <token>.
4. An expired/invalid token clears the session and redirects to /login.
5. Protected /dashboard/* routes redirect unauthenticated visitors to /login.

## Components So Far

Reusable building blocks: loading/empty/error states, status badges,
pagination, a confirm dialog, skeleton loaders, an image uploader with
preview, dark mode toggle, and a self-built toast system — plus layouts
for the public site, login, and the dashboard shell.

## Installation

git clone <REPOSITORY_URL>
cd eventify
npm install
copy .env.example .env
npm run dev

Open the URL Vite prints (typically http://localhost:5173).

## Build

npm run build     — type-checks with vue-tsc, then builds to /dist
npm run preview   — preview the production build locally