# Portfolio Web Application

A modern, responsive, database-backed portfolio web application built with React, TypeScript, Tailwind CSS, and Supabase to showcase and manage structured technical projects, experience, credentials, and documentation.

---

## Overview

This application is a full-featured, content-driven portfolio platform designed to dynamically render professional information while offering an integrated administrative content management system (CMS).

The architecture separates content presentation from content storage. The public-facing interface dynamically consumes structured data from a Supabase PostgreSQL backend—with local state cache fallback—allowing all portfolio sections (projects, certifications, skills, experience, education, resumes, and contact configurations) to update in real time when modified in the administrative dashboard.

---

## Core Features

- **Responsive Portfolio Interface**: Clean single-page application with responsive layouts across mobile, tablet, desktop, and ultra-wide screens.
- **Dynamic Content Rendering**: All public sections render iteratively from structured data collections rather than hard-coded markup.
- **Projects & Technical Case Studies**: Showcase of projects with status badges, applied technologies, architecture diagrams, capability checklists, and expandable modal case studies.
- **Project Search & Dynamic Category Filtering**: Search by title, technology, description, or category, combined with automatically derived category filters.
- **Skills & Technical Domains**: Categorized technical skills matrix with tool counts and flexible chip wrapping.
- **Experience Timeline**: Chronological career and internship milestone timeline with roles, organizations, dates, responsibilities, and methodologies.
- **Education Milestones**: Academic history timeline featuring degrees, institutions, coursework modules, and academic achievements.
- **Verified Certifications**: Credential cards with issuer metadata, completion dates, and interactive credential preview/download modals.
- **Resume Preview & PDF Management**: Dedicated public resume presentation supporting inline PDF/document preview and direct download, driven by a published resume selection workflow.
- **Interactive Modals**: Dedicated modal dialogs for technical case studies, certificate previews, and resume inspection with viewport-constrained internal scrolling and backdrop dismissal.
- **Keyboard & Accessibility Features**: Full keyboard navigation, `Escape` key listeners on all modal interfaces, accessible focus-visible outlines, and reduced-motion media query handling.
- **Empty-State Resilience**: Contextual, graceful fallback messages for sections or search queries when no records exist.
- **Motion & Viewport Transitions**: Lightweight, viewport-triggered entrance animations with bounded stagger delays to ensure immediate responsiveness.
- **Administrative CMS (`/admin`)**: Password-authenticated administrative portal with dedicated managers for projects, certifications, experience, education, resumes, and site settings.
- **Real-Time UI Updates**: Custom event-driven state synchronization (`portfolio_updated`) updating public views immediately upon administrative mutation.

---

## Content Architecture

The application organizes data into discrete relational entities:

- **Projects**: Project title, categorization, status (`Completed`, `In Progress`, `Research`, `Archived`), flagship designation, repository links, live URLs, metrics, architectural pipeline steps, applied technologies, key capabilities, and in-depth problem/solution case studies.
- **Skills**: Domain categories with descriptions and itemized tool/technology arrays.
- **Experience**: Role designations, organizations, employment types, locations, date ranges, responsibility bullet points, and applied frameworks.
- **Certifications**: Credential titles, issuing bodies, completion dates, program durations, credential IDs, verification URLs, and hosted file references.
- **Education**: Degree names, institutions, academic periods, grades/scores, key highlights, and specialized coursework modules.
- **Security Practices**: High-level engineering and security principles with accompanying descriptions and icon mappings.
- **Resumes**: Resume titles, target role classifications, document descriptions, hosted PDF storage paths, and active publication state.
- **Site Settings**: Contact configuration (email, phone, location, LinkedIn, GitHub), professional headline, short bio, and summary narrative.

---

## Dynamic Content & Adaptability

The frontend components are architected to adapt automatically to variable dataset volumes and lengths:

- **Dynamic Iteration**: Sections use array iteration (`.map()`) keyed by stable database IDs to render arbitrary numbers of records.
- **Dynamic Category Derivation**: Project filtering categories are computed from published records rather than hardcoded sets.
- **Flexible Grid Layouts**: CSS Grid configurations (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) create additional rows naturally as records are added or removed.
- **Content-Driven Dimensions**: Card containers avoid rigid fixed heights, expanding vertically based on content length (e.g., long titles, multi-line descriptions, extensive technology chip arrays).
- **Text & Tag Wrapping**: Flexible Flexbox containers and break-word rules prevent overflow for long strings, URLs, or coursework chips.
- **Optional Field Fallbacks**: Missing optional data (such as demo URLs, verification links, or credential IDs) gracefully omits corresponding sub-elements without leaving layout artifacts.
- **Bounded Animation Staggering**: Stagger entrance delays are capped using `Math.min(index * delay, maxDelay)` so large collections do not introduce long animation queues.
- **Contextual Empty States**: Every collection features an intentional empty-state view if no published records are available.

---

## Responsive Design

The interface adapts fluidly across device widths from compact smartphones (320px) to ultra-wide desktop monitors:

- **Mobile (320px – 640px)**: Single-column stacked layouts, touch targets of at least 44px, full-width modal dialogs, and a responsive mobile slide-out navigation menu.
- **Tablet (640px – 1024px)**: Adaptive two-column grids for project cards and certifications, condensed timeline gutters, and responsive horizontal spacing.
- **Desktop (1024px – 1536px)**: Multi-column grid systems, persistent desktop navigation, expanded timeline nodes, and side-by-side technical specification panels.
- **Ultra-Wide (1536px+)**: Constrained maximum container widths (`max-w-6xl`, `max-w-7xl`) centered with automatic margins to maintain comfortable reading line lengths.

---

## UI & Interaction Design

The design language emphasizes a technical, dark-mode visual hierarchy:

- **Color Palette**:
  - Background Canvas: `#0B1220`
  - Elevated Cards: `#111827` and `#151F2E`
  - Structural Borders: `#263449`
  - Primary Accents: `#2563EB` and `#3B82F6`
  - Status Indicators: `#10B981` (Emerald) and `#94A3B8` (Slate)
  - Typography: `#F8FAFC` (Headings) and `#E2E8F0` / `#94A3B8` (Body & Metadata)
- **Interactive Feedback**: Hover state transitions, active navigation highlights, and subtle border color transitions on cards.
- **Modal Experiences**: Fixed-position backdrops with blurred overlays, bounded viewport heights (`max-h-[90vh]`), and dedicated scrollable body containers.

---

## Accessibility

- **Keyboard Dismissal**: Modals attach global `keydown` event listeners to close on `Escape` key press.
- **Focus Management**: Global `:focus-visible` ring outlines (`outline: 2px solid #3B82F6`) provide clear visual feedback during keyboard navigation.
- **Semantic Structure**: Semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<button>`).
- **Contrast Ratios**: High-contrast text pairings designed for dark-mode legibility.
- **Reduced Motion**: Full support for `prefers-reduced-motion: reduce` in global CSS, reducing animation durations to `0.01ms` for users with motion sensitivity.

---

## Motion & Animation

Animations are powered by Motion (`motion/react`) with performance and usability constraints:

- **Viewport Triggers**: Elements animate into view via `whileInView` with `viewport={{ once: true }}` to avoid repetitive reflows during scrolling.
- **Bounded Staggers**: Card lists compute entrance delays with upper limits to maintain quick interactivity.
- **Micro-Interactions**: Subtle scale transformations (`whileHover={{ scale: 1.01 }}`, `whileTap={{ scale: 0.98 }}`) on primary action buttons.
- **Modal Transitions**: Fade and scale entrance/exit transitions managed through `<AnimatePresence>`.

---

## Technology Stack

- **React 19** (`react`, `react-dom`): Component-based UI library using functional components and hooks.
- **TypeScript 5.8** (`typescript`): Static type checking and interface contracts across data models and components.
- **Vite 6** (`vite`, `@vitejs/plugin-react`): Fast development server and production bundler.
- **Tailwind CSS 4** (`tailwindcss`, `@tailwindcss/vite`): Utility-first CSS framework for layout, spacing, colors, and responsive styling.
- **Motion 12** (`motion`): Animation library for smooth viewport entrances and modal transitions.
- **Supabase JS Client** (`@supabase/supabase-js`, `@supabase/ssr`): Client library for PostgreSQL database operations, Supabase Auth, and Supabase Storage.
- **Lucide React** (`lucide-react`): Icon set for technical, navigation, and administrative controls.

---

## Application Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React Application                    │
│                                                        │
│  ┌─────────────────────────┐ ┌──────────────────────┐  │
│  │ Public Portfolio Views  │ │ Administrative CMS   │  │
│  │ (Hero, About, Projects, │ │ (/admin Dashboard,   │  │
│  │  Skills, Experience,    │ │  ProjectsManager,    │  │
│  │  Certs, Education,      │ │  ResumeManager, etc) │  │
│  │  Resume, Contact)       │ └──────────┬───────────┘  │
│  └────────────▲────────────┘            │              │
│               │                         │              │
│               │ (Event: portfolio_updated)              │
│               │                         ▼              │
│  ┌────────────┴─────────────────────────┴───────────┐  │
│  │             portfolioStorage Service             │  │
│  │  - Cached Portfolio State Store                 │  │
│  │  - File Upload Validation (MIME / Ext / Size)    │  │
│  │  - Optimistic In-Memory Updates                  │  │
│  └──────────────────────▲───────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │ HTTPS / REST / Auth
                          ▼
┌────────────────────────────────────────────────────────┐
│                   Supabase Cloud                       │
│                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ PostgreSQL DB   │ │ Supabase Auth   │ │ Storage  │  │
│  │ (RLS Protected) │ │ (Sessions/JWT)  │ │ Buckets  │  │
│  └─────────────────┘ └─────────────────┘ └──────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Frontend View Layer**: Modular components handling presentation, responsive layouts, and user interactions.
- **Data Service Layer (`portfolioStorage.ts`)**: Central state manager handling database read/write operations, in-memory caching, validation, and browser-level dispatching of `portfolio_updated` events.
- **Supabase Backend**: Provides managed PostgreSQL storage, Row Level Security policies, user authentication, and object storage for document/media uploads.

---

## Data & Backend

The application integrates with Supabase for data persistence and file management:

### Database Tables

- `site_settings`: Configuration for personal metadata, contact links, and about narrative.
- `projects`: Project repository with JSONB columns for technologies, architecture steps, metrics, and case studies.
- `certifications`: Professional credentials with verification URLs and PDF paths.
- `experience`: Work history, roles, responsibilities, and methodologies.
- `education`: Academic degrees, scores, highlights, and specialized modules.
- `skills`: Skill categories and associated tool lists.
- `security_practices`: Security and engineering practices with icon identifiers.
- `resumes`: Resume records with target roles, descriptions, and active publication flags.
- `admin_users`: Explicit table mapping authenticated `auth.users(id)` to administrative privileges.

### Storage Buckets

- `projects`: Project media and architecture screenshots.
- `certificates`: Credential PDFs and verification images.
- `resumes`: Uploaded PDF resumes.
- `profile`: Profile and avatar images.

---

## Security

- **Row Level Security (RLS)**: Enforced across all database tables. Public users have read access (`SELECT`) only for records where `published = true`. Administrative mutations (`INSERT`, `UPDATE`, `DELETE`) require verification against the `admin_users` table via `auth.uid()`.
- **Database Helper Function**: `fn_is_admin()` executes with `security definer` to verify administrative status against `admin_users`.
- **Client-Side File Upload Validation**:
  - Size limitation: 10 MB maximum file size.
  - Bucket-specific extension allowlists (e.g., `.pdf` strictly for resumes).
  - MIME type verification and cross-validation against file extension.
  - Random alphanumeric filename sanitization preventing directory traversal.
- **Single Active Resume Publishing**: Administrative publish workflows unpublish all other resumes to guarantee a single published document in public view.
- **Environment Isolation**: Public configuration uses Vite environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) without exposing service keys.

---

## Project Structure

```
.
├── .env.example                     # Environment configuration template
├── index.html                       # Application HTML entry point
├── metadata.json                    # Application metadata and capabilities
├── package.json                     # Project dependencies and npm scripts
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite configuration with Tailwind CSS plugin
├── supabase/
│   └── migrations/                  # Database migration SQL files
│       ├── 000_combined_portfolio_setup.sql
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       ├── 003_seed_data.sql
│       └── 004_storage_buckets.sql
└── src/
    ├── main.tsx                     # React application root entry point
    ├── App.tsx                      # Root component & route orchestrator
    ├── index.css                    # Tailwind CSS imports & global styles
    ├── lib/
    │   └── supabase.ts              # Supabase client initialization
    ├── services/
    │   └── portfolioStorage.ts      # Data storage, mutations, cache & validation
    └── components/
        ├── Navbar.tsx               # Navigation bar with mobile menu
        ├── Hero.tsx                 # Header hero section
        ├── About.tsx                # Professional overview section
        ├── Skills.tsx               # Technical skills matrix
        ├── Projects.tsx             # Project showcase with filters & search
        ├── SecurityPractice.tsx     # Security practices display
        ├── Experience.tsx           # Career experience timeline
        ├── Certifications.tsx       # Credential cards & preview triggers
        ├── Education.tsx            # Academic timeline & coursework
        ├── ResumeSection.tsx        # Public resume preview & download card
        ├── Contact.tsx              # Contact information & message form
        ├── Footer.tsx               # Application footer
        ├── CaseStudyModal.tsx       # Project case study dialog
        ├── CertificateModal.tsx     # Credential preview & download dialog
        ├── ResumeModal.tsx          # Resume viewer dialog
        └── admin/                   # Administrative CMS components
            ├── AdminLayout.tsx
            ├── AdminDashboardView.tsx
            ├── AdminLogin.tsx
            ├── ResetPassword.tsx
            ├── ProjectsManager.tsx
            ├── CertificationsManager.tsx
            ├── ExperienceManager.tsx
            ├── EducationManager.tsx
            ├── ResumeManager.tsx
            └── SiteSettingsManager.tsx
```

---

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone or download the repository.
2. Install project dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Set your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: The application includes local mock data fallbacks, enabling development and preview even without active Supabase credentials).*

### Available Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```
  Runs the local development server on `http://localhost:3000`.

- **Type Check / Lint**:
  ```bash
  npm run lint
  ```
  Executes TypeScript compilation checks (`tsc --noEmit`).

- **Build for Production**:
  ```bash
  npm run build
  ```
  Bundles optimized production assets into the `dist/` directory.

- **Preview Production Build**:
  ```bash
  npm run preview
  ```
  Locally serves the built `dist/` directory.
