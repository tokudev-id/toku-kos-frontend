# Frontend Clean Architecture Refactor Plan

## Purpose

This document captures the frontend refactor direction for `toku-kos-frontend` so future implementation work follows one consistent architecture instead of continuing the current page-heavy pattern.

The goal is not to rewrite the app all at once. The goal is to move the codebase toward:

- thin page entrypoints
- feature-based modules
- centralized auth/session/routing
- reusable presentational components
- shared UI behavior for forms, modals, tables, and empty/loading states
- predictable data-fetching and mutation patterns

---

## Current Status

The first clean-architecture slices are already implemented:

### Foundation completed

- Centralized auth/session helpers in `src/features/auth/session.ts`
- Shared route constants in `src/app/paths.ts`
- Shared navigation config in `src/app/navigation.ts`
- Reusable route guards:
  - `src/features/auth/guards/ProtectedRoute.tsx`
  - `src/features/auth/guards/GuestRoute.tsx`
- Auth/session wiring cleaned up in:
  - `src/App.tsx`
  - `src/store/useAuthStore.ts`
  - `src/api/axios.ts`
- Shell/navigation cleanup in:
  - `src/components/Sidebar.tsx`
  - `src/layouts/ResidentLayout.tsx`
  - `src/components/Header.tsx`

### Feature refactors completed

- Billing refactored to:
  - feature hook: `src/features/billing/hooks/useBillingPageData.ts`
  - presentational components under `src/features/billing/components/*`
  - thin page container in `src/pages/Billing.tsx`
- Properties refactored to:
  - feature hook: `src/features/properties/hooks/usePropertiesPage.ts`
  - presentational components under `src/features/properties/components/*`
  - thin page container in `src/pages/Properties.tsx`

---

## Main Problems Still Remaining

### 1. Large page files still mix too many concerns

The following pages still combine fetching, filtering, modal state, form state, mutation logic, and rendering:

- `src/pages/Residents.tsx`
- `src/pages/Overview.tsx`
- `src/pages/Tagihan.tsx`
- `src/pages/Pembayaran.tsx`
- `src/pages/Pengeluaran.tsx`
- `src/pages/PropertyDetails.tsx`
- `src/pages/Inventaris.tsx`

### 2. Shared UI patterns are still duplicated

The app still repeats similar implementations for:

- table layouts
- card grids
- page headers
- search/filter bars
- confirm dialogs
- edit forms
- empty states
- loading skeletons

### 3. Error handling is inconsistent

Patterns still vary between:

- `console.error`
- `alert`
- silent failure
- inline state

This needs one consistent UX path for:

- form validation
- mutation errors
- global API errors
- destructive confirmations

### 4. Feature boundaries are incomplete

The app has some `features/*` structure now, but many modules are still page-centric rather than feature-centric.

### 5. Storybook/design-system workflow does not exist yet

The project has reusable components, but no component workbench for:

- documenting variants
- visual regression review
- building atomic/molecular components intentionally

### 6. Hardcoded placeholder data still exists

Still present in areas like:

- dashboard/overview
- maintenance pages
- finance summary sections

These should be isolated behind fixtures or replaced with real adapters.

---

## Target Architecture

### Folder direction

Recommended structure:

```text
src/
  app/
    navigation.ts
    paths.ts
    providers/
  api/
  components/
    atoms/
    molecules/
    organisms/
    layouts/
  features/
    auth/
      guards/
      hooks/
      session.ts
    billing/
      components/
      hooks/
      types/
    properties/
      components/
      hooks/
      types/
    residents/
      components/
      hooks/
      types/
    invoices/
    payments/
    expenses/
    dashboard/
    inventory/
    maintenance/
  hooks/
  layouts/
  pages/
  store/
  utils/
```

### Responsibility rules

#### `pages/*`

- route entrypoints only
- compose feature modules
- minimal orchestration

#### `features/<domain>/hooks/*`

- server data loading
- mutation orchestration
- feature-level UI state
- derived view state

#### `features/<domain>/components/*`

- presentational rendering
- local UI interaction only
- no direct API calls

#### `components/*`

- fully shared UI primitives and reusable cross-feature building blocks

#### `api/*`

- transport layer only
- no routing logic
- no component concerns

---

## Refactor Principles

### Principle 1: Move logic out of page files

Every major page should become:

- one route container
- one or more feature hooks
- a set of feature components

### Principle 2: Prefer feature modules over generic dumping grounds

If code is specific to residents, invoices, maintenance, or properties, keep it under that feature rather than `components/`.

### Principle 3: Shared UI belongs in reusable layers only after repetition is proven

Do not create abstract wrappers too early. Extract shared primitives after at least 2-3 real usages.

### Principle 4: Centralize session, paths, navigation, and error conventions

These concerns should not be reimplemented in each page.

### Principle 5: Keep refactors behavior-preserving unless explicitly improving UX

Structure first, then UX upgrades in a separate pass.

---

## Phased Refactor Roadmap

## Phase 1: Foundation

Status: `completed`

Scope:

- central auth/session
- route guards
- shared path config
- shared navigation config
- shell cleanup

Delivered:

- `auth/session.ts`
- `app/paths.ts`
- `app/navigation.ts`
- auth guards
- route updates
- session cleanup in store/interceptor

---

## Phase 2: Establish feature-module pattern

Status: `in progress`

Goal:

Use a few representative pages to set the standard for the rest of the codebase.

Completed:

- Billing
- Properties

Acceptance criteria:

- page file stays small
- API calls move into feature hook
- card/list/modal sections extracted into focused components
- route paths use shared constants where possible

---

## Phase 3: Refactor highest-value page modules

Status: `next`

Priority order:

1. `Residents`
2. `Overview`
3. `Tagihan`
4. `Pembayaran`
5. `Pengeluaran`
6. `PropertyDetails`
7. `Inventaris`

### 3.1 Residents

Target module:

```text
src/features/residents/
  components/
    ResidentsHeader.tsx
    ResidentsSearchBar.tsx
    ResidentsTable.tsx
    ResidentRowActions.tsx
    EditResidentModal.tsx
    CheckoutResidentModal.tsx
    KtpModal.tsx
  hooks/
    useResidentsPage.ts
```

Responsibilities to extract:

- fetch residents
- filter residents
- edit resident form state
- checkout flow
- KTP upload/view flow
- row action menu behavior

### 3.2 Overview

Target module:

```text
src/features/dashboard/
  components/
    DashboardMetrics.tsx
    RevenueChartSection.tsx
    CostBreakdownCard.tsx
    RecentTransactionsPanel.tsx
    MaintenanceRequestsPanel.tsx
  hooks/
    useDashboardOverview.ts
```

Responsibilities to extract:

- dashboard summary loading
- placeholder analytics segregation
- mock cost data isolation
- action button behavior

### 3.3 Tagihan / invoices

Target module:

```text
src/features/invoices/
  components/
  hooks/
```

Responsibilities to extract:

- list loading
- filters
- invoice creation/editing
- status formatting
- invoice actions

### 3.4 Pembayaran / payments

Target module:

```text
src/features/payments/
  components/
  hooks/
```

Responsibilities to extract:

- payment list state
- approval/rejection actions
- proof/document UI

### 3.5 Pengeluaran / expenses

Target module:

```text
src/features/expenses/
  components/
  hooks/
```

Responsibilities to extract:

- expenses loading
- create/edit/delete actions
- filtering and summaries

### 3.6 PropertyDetails

Target module:

```text
src/features/property-details/
  components/
  hooks/
```

Responsibilities to extract:

- rooms/inventory/related views
- tab state
- room operations
- local modal orchestration

### 3.7 Inventaris

Target module:

```text
src/features/inventory/
  components/
  hooks/
```

Responsibilities to extract:

- inventory list state
- item actions
- room filter state

---

## Phase 4: Shared UI standardization

Status: `planned`

After 2-3 more feature refactors, extract stable cross-feature building blocks:

### Candidate reusable organisms

- `PageHeader`
- `SearchToolbar`
- `DataTable`
- `EmptyState`
- `ConfirmDialog`
- `EntityFormModal`
- `StatusBadge`
- `LoadingCardGrid`

### Candidate shared hooks

- `useDisclosure`
- `useConfirmAction`
- `useSearchFilter`
- `useAsyncAction`

Do this only after real repetition is visible across feature modules.

---

## Phase 5: Error-handling and form architecture

Status: `planned`

Introduce a consistent pattern for:

- mutation error display
- validation error mapping
- destructive action confirmation
- upload-state feedback

Recommended additions:

- a shared toast/notification abstraction
- reusable form error components
- standardized async button/loading states
- error boundary strategy for page-level failures

---

## Phase 6: Storybook and design-system workflow

Status: `planned`

Add Storybook after core reusable components stabilize.

Initial Storybook scope:

- atoms
- molecules
- extracted organisms
- modal variants
- table states
- empty/loading/error states

Why later:

- too early now would document unstable components
- better after Phase 3 and Phase 4 provide clearer shared patterns

---

## Phase 7: Placeholder and hardcoded data cleanup

Status: `planned`

Remove or isolate hardcoded data from:

- `Overview`
- maintenance pages
- finance-related placeholders

Rules:

- mock/demo data should live in fixtures, not in production page code
- placeholder sections should be isolated behind explicit components

---

## Technical Standards For Future Refactors

### Page rules

- page file should mostly compose modules
- avoid direct API calls inside page file
- avoid large inline modal implementations

### Hook rules

- one hook per feature page when possible
- return state and action methods
- derive filtered/sorted data inside hook when feature-owned

### Component rules

- presentational components should receive data and callbacks via props
- avoid importing services directly into presentational components
- keep local interaction state only when component-owned

### Routing rules

- use `appPaths` instead of hardcoded route strings where practical

### Session rules

- use shared session helpers
- avoid direct `localStorage` reads/writes outside session/store infrastructure

---

## Recommended Next Implementation Steps

### Immediate next task

Refactor `src/pages/Residents.tsx` using the same pattern as Billing and Properties.

### After that

1. Refactor `Overview`
2. Refactor `Tagihan`
3. Standardize shared `PageHeader`, `SearchToolbar`, and `ConfirmDialog`
4. Audit and unify mutation error handling
5. Prepare Storybook setup once shared components stabilize

---

## Definition of Success

The frontend refactor is succeeding when:

- most route pages are under ~80 lines and mostly declarative
- feature logic lives in `features/<domain>/hooks`
- repeated UI sections live in feature components or shared organisms
- auth/routing/session logic is not duplicated
- adding a new screen follows an obvious structure
- Storybook can document the reusable parts of the UI safely

---

## Notes

- This plan favors incremental refactoring over a risky rewrite.
- Backend contracts still need separate cleanup in some domains, but this file focuses on frontend architecture only.
- Where existing feature behavior is incorrect because of API mismatch, fix architecture first, then resolve contract issues in targeted follow-up work.
