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