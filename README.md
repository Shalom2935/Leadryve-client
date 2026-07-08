# Leadryve Client

Leadryve Client is the React and TypeScript frontend for **Leadryve**, a B2B lead-generation platform that helps businesses create prospecting missions, track generated leads, and manage their sales outreach workflow.

This repository contains both the public marketing website and the authenticated application interface used by Leadryve users.

Backend repository: https://github.com/Shalom2935/Leadryve-api

---

## Table of Contents

- [Overview](#overview)
- [Product Workflow](#product-workflow)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Application Structure](#application-structure)
- [Routing Model](#routing-model)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Local Development](#local-development)
- [Engineering Highlights](#engineering-highlights)
- [Future Improvements](#future-improvements)

---

## Overview

Leadryve helps businesses structure their prospecting process. Users can define their business profile, create a prospecting mission, request leads for a target sector and location, monitor campaign progress, and prepare the next steps of outreach.

The frontend provides two main experiences:

1. **Public website** — landing page, pricing page, privacy policy, and terms of service.
2. **Authenticated application** — dashboard, profile setup, mission management, settings, and integration callback flows.

The application is designed as a product-facing frontend rather than a static landing page. It includes protected routes, API-backed state, authentication flow handling, schema validation, and frontend test coverage.

---

## Product Workflow

```text
Visitor discovers Leadryve
        ↓
User creates an account or logs in
        ↓
User confirms email and completes profile
        ↓
User creates a prospecting mission
        ↓
Backend triggers lead generation
        ↓
Frontend displays mission progress and mission details
        ↓
User reviews leads and prepares outreach actions
```

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Radix UI / Shadcn-style UI primitives
- Zod
- Recharts
- Lucide React
- Vitest
- Testing Library
- jsdom

---

## Core Features

### Public Website

- Landing page
- Pricing page
- Privacy policy page
- Terms of service page
- Product call-to-action links
- Responsive marketing layout

### Authentication Experience

- Registration page
- Login page
- Email confirmation flow
- Password reset request flow
- Password reset success flow
- Protected route handling
- Client-side authentication store

### User Profile Flow

- Profile setup
- Profile update
- Business information capture
- Company and service positioning fields
- Email provider preparation

### Mission Management

- Mission listing
- Mission creation
- Mission detail pages
- Campaign progress display
- Grid/list mission views
- Empty, loading, and error handling paths

### Integration Pages

- Gmail callback page
- Microsoft callback page
- Settings page for account and integration workflows

---

## Application Structure

```text
src/
  components/
    layout/
    ui/
  hooks/
    useAuth.tsx
    usePageTitle.ts
  lib/
    schemas.ts
    schemas.test.ts
  pages/
    Auth.tsx
    LandingPage.tsx
    LandingPage.test.tsx
    Index.tsx
    Missions.tsx
    MissionDetail.tsx
    CreateMission.tsx
    ProfileSetup.tsx
    ProfileUpdate.tsx
    Settings.tsx
    GmailCallback.tsx
    MicrosoftCallback.tsx
  store/
    authStore.ts
    authStore.test.ts
  App.tsx
```

---

## Routing Model

The application separates the public website from the authenticated app experience.

Public routes include:

```text
/
/pricing
/privacy-policy
/terms-of-service
```

Authenticated routes include:

```text
/auth
/auth/reset-password
/auth/check-email
/auth/password-reset-success
/auth/confirm-email
/profile
/profile-update
/missions
/missions/create
/missions/:id
/settings
/gmail/callback
/microsoft/callback
```

The app detects the application context through either an `app.` subdomain or the `mode=app` query parameter. This allows the same frontend codebase to serve both the public website and the protected application shell.

For local development, the authenticated app can be opened with:

```text
http://localhost:8080?mode=app
```

---

## API Integration

The frontend communicates with the Leadryve FastAPI backend through a configurable API base URL.

Create a `.env` file at the project root:

```env
VITE_API_BASE=http://localhost:8000/api
```

When the environment variable is not defined, the frontend falls back to `/api`, which is useful for reverse-proxy deployments.

Authenticated requests use the JWT token stored by the authentication store.

---

## Testing

The project uses **Vitest**, **Testing Library**, and **jsdom**.

Current test coverage includes:

| Test file | Purpose |
|---|---|
| `src/lib/schemas.test.ts` | Validates login, mission, and lead schemas with Zod. |
| `src/store/authStore.test.ts` | Covers login persistence, profile fetching, logout cleanup, and 401 handling. |
| `src/pages/LandingPage.test.tsx` | Verifies the public landing page value proposition, CTA links, and four-step workflow. |

Run the test suite:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

---

## Local Development

### Prerequisites

- Node.js
- npm
- Git
- Running instance of the Leadryve API

### Setup

Clone the repository:

```bash
git clone https://github.com/Shalom2935/Leadryve-client.git
cd Leadryve-client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE=http://localhost:8000/api
```

Run the development server:

```bash
npm run dev
```

The Vite development server is configured to run on:

```text
http://localhost:8080
```

Open the public website:

```text
http://localhost:8080
```

Open the authenticated app experience locally:

```text
http://localhost:8080?mode=app
```

Preview a production build:

```bash
npm run preview
```

---
