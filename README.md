# Portfolio Web Application

A responsive, database-backed portfolio web application built with React, TypeScript, Tailwind CSS, and Supabase. The application separates structured professional content from its visual presentation, allowing portfolio entries to be managed via an administrative interface while the public frontend dynamically adapts its layouts in real time.

---

## Overview

This application is a content-driven portfolio platform designed to present structured technical projects, credentials, experience, and documentation.

The core architectural differentiator is its dynamic content adaptability: rather than relying on hardcoded static sections, the public frontend consumes structured records from a Supabase PostgreSQL backend (with local fallback caching). When content is created, modified, or removed through the administrative dashboard, the public interface reflows and scales without requiring code edits or layout redesigns.

---

## Core Features

- **Dynamic Content Flow**: Public sections render iteratively from structured data collections with real-time UI synchronization upon administrative updates.
- **Projects & Case Studies**: Project cards featuring status indicators, applied technologies, architecture workflows, and expandable modal case studies.
- **Search & Dynamic Category Filtering**: Search across titles, technologies, and descriptions, paired with category tabs derived dynamically from published records.
- **Skills Matrix**: Categorized technical tool and framework inventories with dynamic wrapping.
- **Experience Timeline**: Chronological career and role milestone timeline with responsibilities and applied methodologies.
- **Academic Milestones**: Academic history timeline featuring degrees, institutions, coursework modules, and achievements.
- **Verified Certifications**: Credential cards with issuer metadata, dates, and interactive credential preview/download modals.
- **Resume Presentation & PDF Management**: Dedicated public resume preview and download section driven by an administrative single-active-document publishing workflow.
- **Interactive Modal System**: Viewport-constrained modal dialogs for technical case studies, certificate inspection, and resume viewing with backdrop and keyboard dismissal.
- **Administrative CMS (`/admin`)**: Password-authenticated administrative portal for managing projects, certifications, experience, education, skills, resumes, and site settings.

---

## Content Architecture

The application structures portfolio content into modular domain entities:

- **Projects**: Project metadata, status designations, repository/demo URLs, architecture workflow steps, technology tags, and structured problem/solution case studies.
- **Skills**: Domain categories with descriptions and associated tool inventories.
- **Experience**: Career milestones, roles, organizations, date ranges, key responsibilities, and applied frameworks.
- **Certifications**: Technical credentials, issuing organizations, verification links, and hosted document references.
- **Education**: Academic degrees, institutions, academic periods, grades/scores, and specialized coursework areas.
- **Security Practices**: High-level engineering and security focus areas.
- **Resumes**: Resume document records, role target classifications, and active publication state.
- **Site Settings**: Public contact endpoints, professional summary narrative, and site configuration.

---

## Dynamic Content & Adaptability

The public frontend is engineered to adapt automatically as content volumes change:

- **Dynamic Rendering**: Sections render items from array state using stable database identifiers as React keys.
- **Dynamic Category Derivation**: Project category filters are generated dynamically from active project records rather than fixed enumerations.
- **Responsive Grids**: Grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) create additional rows naturally as records are added or removed.
- **Content-Driven Sizing**: Cards and containers use intrinsic vertical sizing rather than rigid fixed heights, expanding gracefully to accommodate variable text lengths.
- **Text & Tag Wrapping**: Flexible Flexbox containers and word-break rules prevent overflow for long titles, URLs, or technology tags.
- **Optional Field Handling**: Missing optional attributes (e.g., demo links, credential IDs, or specialized coursework) omit corresponding sub-elements cleanly without broken gaps.
- **Bounded Animation Staggering**: Viewport entrance animations cap stagger delays (`Math.min(index * delay, maxDelay)`), ensuring rapid visual readiness regardless of list length.
- **Contextual Empty States**: Every collection features a fallback state when no published records match the current filter or category.

---

## Responsive Design

The interface adapts across mobile, tablet, desktop, and ultra-wide displays:

- **Mobile Viewports**: Single-column stacked layouts, touch-friendly interactive targets (minimum 44px), full-width modal views, and a slide-out navigation drawer.
- **Tablet Viewports**: Two-column grid reflows, adjusted timeline spacing, and responsive card arrangements.
- **Desktop Viewports**: Multi-column grids, horizontal timeline nodes, and side-by-side technical specification panels.
- **Ultra-Wide Viewports**: Bounded max-width containers (`max-w-6xl`, `max-w-7xl`) centered with automatic margins to maintain comfortable reading measure.

---

## UI & Interaction Design

- **Visual System**: Technical dark interface hierarchy with layered card elevations, contrasting structural borders, subtle blue accents, and emerald status badges.
- **Micro-Interactions**: Smooth hover state transitions, active navigation section indicators, and responsive button feedback.
- **Modal Architecture**: Backdrop overlays with internal body scrolling, preserving header visibility, close controls, and viewport boundaries.

---

## Accessibility

- **Keyboard Navigation**: Standard tab ordering, clear `:focus-visible` focus ring indicators, and global `Escape` key listeners on all modals.
- **Semantic HTML**: Structural elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<button>`) for clear document hierarchy.
- **Contrast**: High-contrast text pairings designed for dark-mode readability.
- **Reduced Motion**: Respects user system preferences via `prefers-reduced-motion: reduce`, minimizing animation transitions.

---

## Motion & Animation

- **Viewport Triggers**: Elements animate into view using `whileInView` with single-fire execution (`viewport={{ once: true }}`) to avoid layout recalculations during scrolling.
- **Bounded Staggers**: Card lists employ capped stagger delays to maintain fast rendering performance.
- **Modal Transitions**: Smooth entry and exit transitions managed with `<AnimatePresence>`.

---

## Technology Stack

- **React 19** (`react`, `react-dom`): Component-based UI architecture utilizing functional components and hooks.
- **TypeScript 5.8** (`typescript`): Static typing and strict interfaces for data models and component props.
- **Vite 6** (`vite`, `@vitejs/plugin-react`): Build tooling and development server.
- **Tailwind CSS 4** (`tailwindcss`, `@tailwindcss/vite`): Utility-first CSS framework for layout, spacing, and responsive styling.
- **Motion 12** (`motion`): Animation library for viewport entrances and modal transitions.
- **Supabase Client** (`@supabase/supabase-js`, `@supabase/ssr`): Client integration for PostgreSQL database queries, authentication, and object storage.
- **Lucide React** (`lucide-react`): Icon library for navigation, domain markers, and administrative controls.

---

## Application Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React Application                    │
│                                                        │
│  ┌─────────────────────────┐ ┌──────────────────────┐  │
│  │ Public Portfolio Views  │ │ Administrative CMS   │  │
│  │ (Projects, Skills,      │ │ (/admin Dashboard,   │  │
│  │  Experience, Education, │ │  Entity Managers &   │  │
│  │  Certs, Resume, Contact)│ │  Content Editors)    │  │
│  └────────────▲────────────┘ └──────────┬───────────┘  │
│               │                         │              │
│               │ (Event: portfolio_updated)              │
│               │                         ▼              │
│  ┌────────────┴─────────────────────────┴───────────┐  │
│  │             portfolioStorage Service             │  │
│  │  - Cached State Store & Optimistic Updates      │  │
│  │  - File Upload Validation (MIME / Ext / Size)    │  │
│  └──────────────────────▲───────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │ HTTPS / REST / Auth
                          ▼
┌────────────────────────────────────────────────────────┐
│                   Supabase Backend                     │
│                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ PostgreSQL DB   │ │ Supabase Auth   │ │ Storage  │  │
│  │ (RLS Protected) │ │ (Sessions/JWT)  │ │ Buckets  │  │
│  └─────────────────┘ └─────────────────┘ └──────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## Data & Backend

The application interfaces with Supabase for data persistence and asset management:

### Database Schema
- Relational tables for `projects`, `skills`, `experience`, `certifications`, `education`, `security_practices`, `resumes`, `site_settings`, and `admin_users`.
- JSONB data structures for extensible arrays such as architecture steps, applied technologies, metrics, and case study sections.

### Storage Buckets
- Dedicated storage buckets for project media, certificate files, uploaded PDF resumes, and profile assets.

---

## Security

- **Row Level Security (RLS)**: Enforced on Supabase PostgreSQL tables. Public clients are restricted to read operations (`SELECT`) on published records (`published = true`). Data mutations (`INSERT`, `UPDATE`, `DELETE`) require authentication verified against the `admin_users` table.
- **Client-Side File Upload Safeguards**:
  - Maximum upload size enforcement (10 MB).
  - Strict extension allowlists per target bucket.
  - MIME type validation cross-referenced with file extensions.
  - Random alphanumeric filename sanitization.
- **Single Active Resume Publishing**: Administrative publishing logic manages active publication flags to ensure only one resume version is published publicly at a time.
- **Environment Isolation**: Public configuration utilizes client-safe environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) without exposing private service roles.

---

## Project Structure

```
.
├── .env.example                     # Environment variable template
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── supabase/
│   └── migrations/                  # SQL schema, RLS policies, and storage setup
└── src/
    ├── main.tsx                     # Application entry point
    ├── App.tsx                      # Root component & routing
    ├── index.css                    # Global styles & Tailwind imports
    ├── lib/
    │   └── supabase.ts              # Supabase client initialization
    ├── services/
    │   └── portfolioStorage.ts      # Data management, validation & cache service
    └── components/
        ├── admin/                   # Administrative CMS components & managers
        ├── CaseStudyModal.tsx       # Project case study dialog
        ├── CertificateModal.tsx     # Credential preview dialog
        ├── ResumeModal.tsx          # Resume viewer dialog
        └── ...                      # Public portfolio section components
```

---

## Local Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup Instructions

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure your Supabase project parameters:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: The application includes local mock data fallbacks, allowing frontend development and preview even without active Supabase credentials).*

### Available Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```
  Runs the local dev server on `http://localhost:3000`.

- **Type Check / Lint**:
  ```bash
  npm run lint
  ```
  Runs TypeScript type checking (`tsc --noEmit`).

- **Build for Production**:
  ```bash
  npm run build
  ```
  Compiles and bundles production assets into `dist/`.

- **Preview Production Build**:
  ```bash
  npm run preview
  ```
  Serves the production build locally.
