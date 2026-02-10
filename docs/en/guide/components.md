# Components

## General Layout

The application uses a two-column layout on desktop (hero + system log) that collapses to a single column on mobile (breakpoint: 768px).

```
┌──────────────────────────────────────────────┐
│  Header (logo + language toggle)             │
├────────────────────────┬─────────────────────┤
│                        │                     │
│  Hero Container        │  System Activity    │
│  ├── Segmented Control │  Log                │
│  ├── Role Panel        │                     │
│  └── Survey Panel      │                     │
│                        │                     │
├────────────────────────┴─────────────────────┤
│  Footer (version + changelog link)           │
└──────────────────────────────────────────────┘
```

## Header

**File:** `js/components.js`

- Beyond Titles logo (link to `index.html`)
- Language toggle (IT/EN) with flag and language code
- Background: Gi Group blue (`#0056b3`), fixed height 64px
- The toggle emits `CustomEvent('languageChanged')` on language change

## Segmented Control (Tabs)

**File:** `index.html` — managed by `app.js`

Two tabs with segmented control styling:

| Tab | ID | Panel | Visibility |
|---|---|---|---|
| Role | `tab-ruolo` | `panel-ruolo` | Only with `?internal=true` |
| Survey | `tab-sondaggio` | `panel-sondaggio` | Always visible |

When the Role tab is hidden, the Survey panel is the only one visible and the segmented control is not shown.

## Role Search Panel

**File:** `js/app.js`

### Components

- **Search input** — Text field with placeholder, border coloured based on state
- **Clear button** (×) — Visible when there is text, resets all state
- **Suggestions dropdown** — Scrollable list (max 280px), max 15 results
- **Status message** — Shows mapping type and soft skills of the selected role
- **CTA Button** — Main action button with 4 states

### Input States

| State | Border | Description |
|---|---|---|
| Default | Grey | No input |
| Focus | Blue (`#0056b3`) | Active input |
| No Match | Orange (`#e67e22`) | No match found |

### CTA States

| State | Colour | Text |
|---|---|---|
| Disabled | Grey | — |
| Active match | Green (`#27ae60`) | "We have XX offers for you" |
| Incomplete profile | Purple (`#9b59b6`) | "No active offers" |
| No match | Orange (`#e67e22`) | "Discover all offers" |

### Suggestion Badges

Each suggestion in the dropdown shows a coloured badge:

| Type | Badge colour | Text |
|---|---|---|
| `categoria_principale` | Blue (`#0056b3`) | Main |
| `alias` | Light blue (`#3498db`) | Alias |
| `profilo_incompleto` | Purple (`#9b59b6`) | Incomplete |

## Survey Panel

**File:** `js/survey.js`

### Survey Phases

The panel has three mutually exclusive states:

#### 1. Intro (`#survey-intro`)
- Title and subtitle "Beyond Titles"
- Survey type selector (Behavioural & Competency-Based v3.4)
- "Start the Journey" button
- "Suggestions" link to open the preset modal

#### 2. Questions (`#survey-questions`)
- Progress bar with animated fill and "Question X of 10" text
- Question container with 4 radio options (single-choice)
- Navigation: "Back" and "Next" buttons (Next disabled until a selection is made)

#### 3. Results (`#survey-results`)
- **Primary card** — Shows the dominant archetype with colour, claim, description and soft skills
- "Retake the Test" button

## System Activity Log

**File:** `js/app.js` and `js/survey.js`

Terminal-style side panel (dark background, monospace font) that logs in real time:

### Entry Types

| Type | Colour | Content |
|---|---|---|
| `INPUT` | — | User actions (typing, selection) |
| `LOGIC` | — | Database checks, calculations |
| `ROUTING` | — | URL generation, navigation |
| `UI` | — | State changes, button enabling |
| `INFO` | — | Initialisation, data loading |
| `NOMATCH` | — | No match (special formatting) |
| `SURVEY` | — | Survey-specific messages |
| `SCORES TABLE` | — | Live scores table with graphical bars |

The scores table updates after each answer, sorted by decreasing score.

## Modals

### Search Suggestions Modal

Shows 6 detailed search examples with an explanation of the matching logic:

1. **Addetto alla vendita retail** — Main category (74 offers)
2. **Insegnante scuola dell'infanzia** — Alias (1 offer)
3. **Data Scientist** — Incomplete profile (0 offers)
4. **Influencer** — No match (generic search)
5. **Magazziniere** — Missing skills (60 offers)
6. **Web Marketing Expert** — Double null edge case

### Survey Preset Modal

Grid of 8 archetype cards to quickly simulate a result:

- Click on an archetype simulates the corresponding result
- Auto-closes the modal after selection

### SJT Password Modal

Restricted access modal for the SJT v1.0 survey:

- Password field
- Error message (hidden by default)
- "Login" button
- Auth persistence in localStorage

## Footer

**File:** `js/components.js`

- Version text: "Beyond Titles v0.12.0"
- Link to changelog (points to VitePress wiki documentation)
- Dynamically injected by `components.js` for consistency across pages

## Design System

### Main Colours

| CSS Variable | Value | Use |
|---|---|---|
| `--color-primary` | `#0056b3` | Gi Group blue, header, focus |
| `--color-success` | `#27ae60` | Match found, active CTA |
| `--color-warning` | `#e67e22` | No match, warning CTA |
| `--color-background` | `#f4f6f8` | Page background |
| `--color-surface` | `#ffffff` | Cards and panels |
| `--color-text-primary` | `#333333` | Primary text |

### Typography

Font stack: `'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

| Token | Value |
|---|---|
| `--font-size-base` | 16px |
| `--font-size-sm` | 14px |
| `--font-size-lg` | 17px |
| `--font-size-xl` | 24px |

### Spacing

Base unit: 4px

| Token | Value |
|---|---|
| `--spacing-xs` | 4px |
| `--spacing-sm` | 8px |
| `--spacing-md` | 16px |
| `--spacing-lg` | 24px |
| `--spacing-xl` | 32px |

### Breakpoint

- **Mobile:** < 768px (single column)
- **Desktop:** ≥ 768px (two columns: hero + log)
- **Max container width:** 1200px
