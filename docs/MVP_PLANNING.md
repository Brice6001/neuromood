# NeuroMood — MVP Issue Plan

This document defines the complete set of GitHub issues needed to take NeuroMood
from its current UI scaffold to a working MVP. Issues are grouped by milestone and
include labels, acceptance criteria, and technical notes.

---

## Milestones

| # | Title | Purpose | Suggested Due Date |
|---|-------|---------|-------------------|
| 1 | **Week 1 – AI Fundamentals for Web Development** *(existing)* | Project setup, design system, scaffolding | May 15, 2026 |
| 2 | **Week 2 – MVP Core Features** *(new)* | All functional features, state, and data persistence | May 22, 2026 |
| 3 | **Week 3 – Polish & Launch** *(new)* | Dark mode, accessibility, PWA, documentation | May 29, 2026 |

---

## Label Taxonomy

Create these labels if they don't already exist:

| Label | Color | Purpose |
|-------|-------|---------|
| `feature` | `#0075ca` | New user-facing functionality |
| `bug` | `#d73a4a` | Something broken or incorrect |
| `design` | `#e4e669` | UI/UX design work |
| `AI` | `#7057ff` | Gemini API / AI-related work |
| `accessibility` | `#008672` | a11y improvements |
| `documentation` | `#0075ca` | Docs and planning |
| `chore` | `#cfd3d7` | Config, refactor, cleanup |
| `good first issue` | `#7fc97f` | Suitable for newcomers |

---

## Issues to CLOSE (noise from workshop)

These existing issues are off-topic, too vague, or already resolved. Close them with a brief comment.

| # | Title | Reason to Close |
|---|-------|----------------|
| #12 | TASK | Duplicate of closed #13; no actionable detail |
| #10 | about this project issues | Color question, not an actionable issue |
| #9 | Colors | Too vague; absorbed into design system issue |
| #7 | AfriTech Train | Meta training note, not a dev issue |
| #6 | Not able to publish | Git how-to question, not a repo issue |
| #5 | Analytics | Study note, not actionable |
| #3 | Help | Git collaboration question, not a dev issue |

---

## Issues to UPDATE (keep, improve the body)

### #1 — Improve Colors
**Update title to:** `Design: Apply brand colors consistently across all pages`
**Labels:** `design`, `good first issue`
**Milestone:** Week 1 – AI Fundamentals for Web Development

**Updated body:**
```
## Problem
The app has a complete Material Design 3 color token system defined in `src/index.css`
but several pages and components reference hardcoded hex values (e.g. `#d6654b`,
`#de6044`) instead of using the design tokens. Some text contrast ratios may not
meet WCAG AA.

## Acceptance Criteria
- [ ] All hardcoded hex color values in `src/` are replaced with the corresponding
      CSS custom property from `src/index.css`
- [ ] The primary page title ("NeuroMood") uses `text-primary` consistently
- [ ] Hover/active states on buttons use token-based colors only
- [ ] No inline `style` attributes for color values

## Files to Review
- `src/components/Sidebar.tsx` — line 50: hardcoded `#d6654b`
- `src/pages/MoodLogger.tsx` — line 67: hardcoded `#de6044`
```

---

### #14 — Task: Color Palette
**Update title to:** `Design: Finalize and document the color palette`
**Labels:** `design`, `documentation`
**Milestone:** Week 1 – AI Fundamentals for Web Development

**Updated body:**
```
## Goal
Lock in the final color palette used throughout the app and document it so all
contributors apply colors consistently.

## Acceptance Criteria
- [ ] All color tokens in `src/index.css` `@theme` block are reviewed and finalised
- [ ] A palette swatch table is added to `docs/MVP_PLANNING.md` or a dedicated
      `docs/DESIGN_SYSTEM.md`
- [ ] Light-mode palette is complete (primary, secondary, tertiary, surface,
      background, error, success)
- [ ] Dark-mode palette tokens are defined (even if the toggle is in Week 3)

## Context
Current palette lives in `src/index.css` lines 5–66. It follows Material Design 3
conventions (on-surface, surface-container, etc.).
```

---

## New Issues — Week 1 (Setup & Design)

### ISSUE A — `chore`: Fix page title, app name, and metadata
**Labels:** `chore`, `good first issue`
**Milestone:** Week 1 – AI Fundamentals for Web Development

```
## Problem
The HTML page title reads "My Google AI Studio App" and `metadata.json` has empty
`name` and `description` fields. These need to be updated before any public sharing.

## Acceptance Criteria
- [ ] `index.html` `<title>` updated to "NeuroMood — Your Wellness Partner"
- [ ] `<meta name="description">` added in `index.html`
- [ ] `metadata.json` `name` set to `"NeuroMood"` and `description` filled in
- [ ] App favicon added (can be a simple emoji or SVG to start)

## Files
- `index.html` line 6
- `metadata.json` lines 2–3
```

---

### ISSUE B — `bug`: Fix broken navigation links (dead routes)
**Labels:** `bug`
**Milestone:** Week 1 – AI Fundamentals for Web Development

```
## Problem
The sidebar (`src/components/Sidebar.tsx`) and mobile bottom nav
(`src/components/MobileBottomNav.tsx`) link to `/insights`, `/history`, and
`/settings`, but none of these routes exist in the router (`src/App.tsx`).
Clicking them renders a blank page with no feedback to the user.

## Acceptance Criteria
- [ ] All five navigation routes are registered in `src/App.tsx`:
      `/`, `/log`, `/insights`, `/history`, `/settings`
- [ ] Each unimplemented page shows a placeholder screen (title + "Coming soon"
      message) instead of a blank page
- [ ] No 404-style blank renders occur from any nav link

## Files
- `src/App.tsx` — add routes
- `src/pages/` — create `Insights.tsx`, `History.tsx`, `Settings.tsx` stubs
```

---

## New Issues — Week 2 (MVP Core Features)

### ISSUE C — `feature`: Functional Mood Logger — form state and local persistence
**Labels:** `feature`
**Milestone:** Week 2 – MVP Core Features

```
## User Story
As a user, I want to select my current mood, set an intensity, add an optional note,
and save the entry so that I can review it later.

## Current State
The Mood Logger UI exists (`src/pages/MoodLogger.tsx`) but is entirely static:
the emoji buttons are not interactive, the intensity slider is a visual mock,
the textarea does not capture input, and "Save Entry" has no handler.

## Acceptance Criteria
- [ ] Clicking an emoji button selects that mood and shows a visual selected state
- [ ] Intensity slider is a real `<input type="range" min="1" max="10">` element
- [ ] Textarea captures and stores journal note text in component state
- [ ] "Save Entry" button calls a `saveMoodEntry()` function that writes the entry
      to `localStorage` as JSON with shape:
      `{ id, timestamp, mood, intensity, note }`
- [ ] After saving, the user sees a brief success confirmation (toast or redirect)
- [ ] Form resets after a successful save

## Technical Notes
- Use `React.useState` for form state
- Use a helper module `src/utils/storage.ts` that wraps `localStorage` get/set
- Entry list key in localStorage: `"neuromood_entries"`
```

---

### ISSUE D — `feature`: History page — list and browse past mood entries
**Labels:** `feature`
**Milestone:** Week 2 – MVP Core Features

```
## User Story
As a user, I want to see a list of all my past mood entries so that I can reflect
on my emotional patterns over time.

## Current State
`/history` is a dead route with no component.

## Acceptance Criteria
- [ ] `src/pages/History.tsx` is created and registered at `/history`
- [ ] The page reads entries from `localStorage` ("neuromood_entries")
- [ ] Entries are listed in reverse-chronological order
- [ ] Each entry card shows: mood emoji/icon, mood label, intensity, date/time,
      and a snippet of the note (if any)
- [ ] If no entries exist, an empty state is shown with a CTA to log a mood
- [ ] The page is responsive (single column on mobile, grid on desktop)

## Technical Notes
- Reuse the storage helper from Issue C (`src/utils/storage.ts`)
- Mood-to-emoji mapping should live in `src/utils/moodConfig.ts`
```

---

### ISSUE E — `feature` + `AI`: AI Insights page — Gemini-powered mood analysis
**Labels:** `feature`, `AI`
**Milestone:** Week 2 – MVP Core Features

```
## User Story
As a user, I want to receive AI-generated insights about my mood patterns so that
I can understand what affects my wellbeing.

## Current State
`/insights` is a dead route. The `@google/genai` SDK is installed but never called.

## Acceptance Criteria
- [ ] `src/pages/Insights.tsx` is created and registered at `/insights`
- [ ] On page load, the last 7 days of mood entries are read from localStorage
- [ ] If fewer than 3 entries exist, the page shows an encouraging empty state
      ("Log a few more moods to unlock insights")
- [ ] If ≥3 entries exist, a prompt is sent to the Gemini API summarising the
      entries and asking for:
        1. A 2–3 sentence mood summary for the week
        2. One actionable wellness suggestion
- [ ] The API response is rendered in a card with a loading skeleton while waiting
- [ ] Errors (API key missing, network failure) are caught and a friendly message
      is shown instead of a crash

## Technical Notes
- Use `src/utils/gemini.ts` as the API wrapper (import from `@google/genai`)
- The Gemini API key is accessed via `process.env.GEMINI_API_KEY` (already wired
  in `vite.config.ts` line 11)
- Do NOT log or display the API key anywhere in the UI
- Keep the prompt in a constants file (`src/utils/prompts.ts`) for easy editing

## Security Note
The Gemini key is injected client-side by Vite. For production this should move
to a server-side proxy, but for MVP/demo this is acceptable.
```

---

### ISSUE F — `feature`: Settings page — user name and preferences
**Labels:** `feature`
**Milestone:** Week 2 – MVP Core Features

```
## User Story
As a user, I want to set my display name and basic preferences so that the
dashboard greets me correctly and the app feels personalised.

## Current State
The dashboard greets the user as "Alex" (hardcoded, `src/pages/Dashboard.tsx`
line 9). `/settings` is a dead route.

## Acceptance Criteria
- [ ] `src/pages/Settings.tsx` is created and registered at `/settings`
- [ ] User can enter and save their display name
- [ ] Display name is persisted to localStorage under key `"neuromood_user"`
- [ ] Dashboard greeting reads the name from localStorage on mount
- [ ] Settings page includes a section for future preferences (dark mode toggle
      placeholder is fine for now)

## Files
- `src/pages/Settings.tsx` — create
- `src/pages/Dashboard.tsx` line 9 — replace hardcoded "Alex" with stored name
```

---

### ISSUE G — `feature`: Connect Dashboard to real logged data
**Labels:** `feature`
**Milestone:** Week 2 – MVP Core Features

```
## User Story
As a user, I want my dashboard to reflect my actual mood entries so that the
overview is meaningful and accurate.

## Current State
All dashboard content is static mock data (hardcoded mood, hardcoded chart paths,
hardcoded history list).

## Acceptance Criteria
- [ ] "Current Balance" card shows the most recent logged mood (or "No entries yet"
      if localStorage is empty)
- [ ] "Recent History" card lists the last 3 entries from localStorage
- [ ] "Mood Trend" chart renders the actual energy/calmness values from the
      last 7 entries as an SVG polyline (or plain CSS bar chart)
- [ ] "AI Insight" card content is seeded from the last Gemini response stored
      in localStorage (or a placeholder if none exists)
- [ ] All hardcoded user data (images, names, timestamps) is replaced

## Technical Notes
- Reuse `src/utils/storage.ts` for data access
- The chart does not need a third-party charting library; a simple SVG
  polyline scaled to the data range is sufficient for MVP
```

---

## New Issues — Week 3 (Polish & Launch)

### ISSUE H — `feature` + `design`: Dark mode toggle
**Labels:** `feature`, `design`
**Milestone:** Week 3 – Polish & Launch

```
## User Story
As a user, I want to switch between light and dark modes so that the app is
comfortable to use in different lighting conditions.

## Current State
The design token set in `src/index.css` only defines a light palette. An earlier
issue (#8, now closed) requested this feature.

## Acceptance Criteria
- [ ] A complete dark-mode palette is added to `src/index.css` under
      `@media (prefers-color-scheme: dark)` or a `[data-theme="dark"]` class
- [ ] A toggle button is visible in the Settings page and in the mobile top bar
- [ ] User's preference is persisted to localStorage
- [ ] The toggle respects the OS-level `prefers-color-scheme` as the default
- [ ] All pages look correct in both modes (no unreadable text or invisible elements)
```

---

### ISSUE I — `accessibility`: Accessibility audit and fixes
**Labels:** `accessibility`
**Milestone:** Week 3 – Polish & Launch

```
## Problem
The app currently lacks several accessibility features that are required for
users who rely on keyboards or screen readers.

## Acceptance Criteria
- [ ] All interactive elements (buttons, links, inputs) are keyboard-focusable
      and have visible focus rings
- [ ] All `<button>` elements without visible text have an `aria-label`
- [ ] The emoji mood selector buttons have accessible labels
      (e.g. `aria-label="Very Satisfied"`)
- [ ] The intensity slider is a real `<input type="range">` with
      `aria-label` and `aria-valuetext`
- [ ] Colour contrast for body text and interactive elements meets WCAG AA
      (4.5:1 for normal text, 3:1 for large text)
- [ ] Page landmarks are correct: `<header>`, `<nav>`, `<main>`, `<footer>`
      where appropriate

## Testing
Run the axe DevTools browser extension on each page and resolve all
"critical" and "serious" violations.
```

---

### ISSUE J — `feature`: Loading states and error handling
**Labels:** `feature`
**Milestone:** Week 3 – Polish & Launch

```
## Problem
The app has no loading indicators or error boundaries. Any async operation
(e.g. Gemini API call) or unexpected error will silently fail or crash the UI.

## Acceptance Criteria
- [ ] A reusable `<LoadingSpinner>` component is created in `src/components/`
- [ ] A reusable `<ErrorMessage>` component is created in `src/components/`
- [ ] The AI Insights page shows a skeleton/spinner while the Gemini API is pending
- [ ] A React Error Boundary wraps the main `<Layout>` and shows a friendly
      fallback instead of a blank white screen on runtime errors
- [ ] Empty states (no entries) are handled gracefully on History and Dashboard
```

---

### ISSUE K — `documentation`: Write a complete README
**Labels:** `documentation`
**Milestone:** Week 3 – Polish & Launch

```
## Problem
The current README (`README.md`) is the default AI Studio template. It gives no
information about the app itself.

## Acceptance Criteria
- [ ] README includes: app name, one-line description, and a screenshot/GIF
- [ ] README explains the key features (mood logging, history, AI insights)
- [ ] README has clear local setup instructions (prerequisites, env vars, run command)
- [ ] README links to the live AI Studio deployment URL
- [ ] README mentions that `GEMINI_API_KEY` is required and where to get one
- [ ] (Optional) CONTRIBUTING section with branching/PR workflow
```

---

### ISSUE L — `chore`: Configure PWA (Progressive Web App)
**Labels:** `chore`
**Milestone:** Week 3 – Polish & Launch

```
## Goal
Make NeuroMood installable as a PWA so users can add it to their home screen
and use core features offline.

## Acceptance Criteria
- [ ] A `public/manifest.json` file is added with name, icons, theme colour,
      and `display: standalone`
- [ ] App icons at 192×192 and 512×512 are added to `public/`
- [ ] `vite-plugin-pwa` (or equivalent) is configured in `vite.config.ts`
- [ ] Lighthouse PWA score is ≥ 90 in production build
- [ ] Offline fallback page is shown when the network is unavailable
```

---

## Summary Checklist

| Issue | Title | Milestone | Labels |
|-------|-------|-----------|--------|
| #1 (update) | Apply brand colors consistently | Week 1 | `design`, `good first issue` |
| #14 (update) | Finalize and document the color palette | Week 1 | `design`, `documentation` |
| A (new) | Fix page title, app name, and metadata | Week 1 | `chore`, `good first issue` |
| B (new) | Fix broken navigation links (dead routes) | Week 1 | `bug` |
| C (new) | Functional Mood Logger — state and persistence | Week 2 | `feature` |
| D (new) | History page — list past mood entries | Week 2 | `feature` |
| E (new) | AI Insights page — Gemini-powered analysis | Week 2 | `feature`, `AI` |
| F (new) | Settings page — user name and preferences | Week 2 | `feature` |
| G (new) | Connect Dashboard to real logged data | Week 2 | `feature` |
| H (new) | Dark mode toggle | Week 3 | `feature`, `design` |
| I (new) | Accessibility audit and fixes | Week 3 | `accessibility` |
| J (new) | Loading states and error handling | Week 3 | `feature` |
| K (new) | Write a complete README | Week 3 | `documentation` |
| L (new) | Configure PWA | Week 3 | `chore` |

**Issues to close** (noise): #3, #5, #6, #7, #9, #10, #12
