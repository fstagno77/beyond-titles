# Restore Role Search (B2B Feature)

This document describes all wiki changes made to hide the Role Search feature.
Use this as a reference to restore the feature when needed.

## Quick Restore

The fastest way to restore everything is via git:

```bash
# Restore commit: 4605785 is the last commit BEFORE the removal
git diff 16fd5e8..4605785 -- docs/ | git apply
# Then rebuild the wiki
npm run docs:build
```

Or revert specific files:

```bash
git checkout 4605785 -- docs/en/index.md docs/index.md
git checkout 4605785 -- docs/en/decisions/index.md docs/decisioni/index.md
git checkout 4605785 -- docs/en/guide/components.md docs/guide/componenti.md
git checkout 4605785 -- docs/en/guide/architecture.md docs/guide/architettura.md
git checkout 4605785 -- docs/en/guide/database.md docs/guide/database.md
git checkout 4605785 -- docs/en/guide/authentication.md docs/guide/autenticazione.md
git checkout 4605785 -- docs/en/guide/data-pipeline.md docs/guide/pipeline-dati.md
git checkout 4605785 -- docs/en/changelog/index.md docs/changelog/index.md
```

---

## Detailed Changes Per File

### 1. docs/en/index.md & docs/index.md (Overview)

**INTRO** — Restore original text:

```
# EN (was):
**Beyond Titles** is a POC (Proof of Concept) for the Gi Group Digital Platform.
The application enables intelligent matching between professional titles and job offers,
combined with a behavioural assessment system for identifying professional archetypes.

# IT (was):
**Beyond Titles** è un POC (Proof of Concept) per la Digital Platform di Gi Group.
L'applicazione consente il matching intelligente tra titoli professionali e offerte di lavoro,
combinato con un sistema di assessment comportamentale per l'identificazione di archetipi professionali.
```

**OBJECTIVES** — Re-add first objective:

```
# EN:
- Match job titles entered by the user against a database of roles and active job offers

# IT:
- Matchare i job title inseriti dall'utente con un database di mansioni e offerte attive
```

**PROJECT STRUCTURE** — Restore app.js description:

```
# EN:
│   ├── app.js                    # Role search and autocomplete (~1200 lines)

# IT:
│   ├── app.js                    # Ricerca ruoli e autocomplete (~1200 righe)
```

**MAIN FEATURES** — Re-add Role Search section (before Behavioural Surveys) and renumber:

```markdown
### 1. Role Search (Role Matching)

The user types a professional title and the system searches for matches in the database
of 604 roles. Three possible scenarios:

- **Direct match** (main category or alias) → Green CTA with link to job offers
- **Incomplete profile** (role without active offers) → Purple CTA with generic search
- **No match** → Orange CTA with free search on gigroup.it

### 2. Behavioural Surveys   ← (was "1.")
### 3. System Activity Log   ← (was "2.")
```

Italian version:
```markdown
### 1. Ricerca Ruoli (Role Matching)

L'utente digita un titolo professionale e il sistema cerca corrispondenze nel database
di 604 mansioni. Tre scenari possibili:

- **Match diretto** (categoria principale o alias) → CTA verde con link alle offerte
- **Profilo incompleto** (mansione senza offerte attive) → CTA viola con ricerca generica
- **Nessun match** → CTA arancione con ricerca libera su gigroup.it

### 2. Survey Comportamentali   ← (was "1.")
### 3. System Activity Log      ← (was "2.")
```

---

### 2. docs/en/decisions/index.md & docs/decisioni/index.md

**ADR-001** — Restore POC mentions:

```
# EN:
Context: "Needed to develop a rapid POC to validate the concept of role matching + behavioural assessment."
Rationale: "Maintenance simplicity for a POC with limited scope"

# IT:
Contesto: "Dovendo sviluppare un POC rapido per validare il concept di matching mansioni + assessment comportamentale."
Motivazione: "Semplicità di manutenzione per un POC con scope limitato"
```

**ADR-002** — Restore POC mentions:

```
# EN:
Rationale: "No dependency on external services for the POC"
Consequences: "All data downloaded by the client (604 entries ≈ acceptable size for a POC)"

# IT:
Motivazione: "Nessuna dipendenza da servizi esterni per il POC"
Conseguenze: "Tutti i dati scaricati dal client (604 voci ≈ dimensione accettabile per un POC)"
```

**ADR-003** — Re-add entire section (after ADR-002):

```markdown
## ADR-003: 3-type mapping system

**Date:** 10 January 2026 | **Status:** Accepted (evolved in v0.7)

### Context
Not all roles in the database have active offers on gigroup.it. Different match scenarios needed to be handled.

### Decision
Introduce three mapping types in the database:
1. `categoria_principale` — direct match with active offers
2. `alias` — alternative name that inherits URL from the main category
3. `profilo_incompleto` — present in the skills DB but without active offers

### Rationale
- Maximise useful matches (aliases cover title variations)
- Explicitly handle profiles without offers (they are not "no match")
- Visually differentiate the three states in the UI (green, light blue, purple)

### Consequences
- More articulated CTA rendering logic (4 states: match, alias, incomplete, no-match)
- Coloured badges in suggestions to guide the user
- The `profilo_incompleto` type still shows associated soft skills
```

Italian version:
```markdown
## ADR-003: Sistema di mapping a 3 tipi

**Data:** 10 gennaio 2026 | **Stato:** Accettata (evoluta in v0.7)

### Contesto
Non tutte le mansioni nel database hanno offerte attive su gigroup.it. Serviva gestire i diversi scenari di corrispondenza.

### Decisione
Introdurre tre tipi di mapping nel database:
1. `categoria_principale` — match diretto con offerte attive
2. `alias` — nome alternativo che eredita URL dalla categoria principale
3. `profilo_incompleto` — presente nel DB competenze ma senza offerte attive

### Motivazione
- Massimizzare le corrispondenze utili (alias coprono varianti di titolo)
- Gestire esplicitamente i profili senza offerte (non sono "nessun match")
- Differenziare visivamente i tre stati nell'UI (verde, azzurro, viola)

### Conseguenze
- Logica di rendering CTA più articolata (4 stati: match, alias, incompleto, no-match)
- Badge colorati nei suggerimenti per orientare l'utente
- Il tipo `profilo_incompleto` mostra comunque le soft skills associate
```

**ADR-007** — Re-add entire section (at the end):

```markdown
## ADR-007: Role tab hidden by default

**Date:** 21 January 2026 | **Status:** Accepted

### Context
The POC serves both internal demos (where role matching is needed) and user testing (where only the survey is needed).

### Decision
Hide the "Role" tab by default and make it visible only with the URL parameter `?internal=true`.

### Rationale
- The end user sees only the survey (focus on assessment)
- The internal team accesses all features with a simple parameter
- No authentication system needed for this distinction

### Consequences
- The segmented control does not appear without the parameter (only the survey panel)
- Internal links must include `?internal=true` to show all features
- Simple but not secure solution (anyone can add the parameter)
```

Italian version:
```markdown
## ADR-007: Tab Ruolo nascosto di default

**Data:** 21 gennaio 2026 | **Stato:** Accettata

### Contesto
Il POC serve sia per demo interne (dove serve il matching mansioni) sia per test utente (dove serve solo la survey).

### Decisione
Nascondere il tab "Ruolo" di default e renderlo visibile solo con il parametro URL `?internal=true`.

### Motivazione
- L'utente finale vede solo la survey (focus sull'assessment)
- Il team interno accede a tutte le funzionalità con un semplice parametro
- Nessun sistema di autenticazione necessario per questa distinzione

### Conseguenze
- Il segmented control non appare senza parametro (solo pannello survey)
- Link interni devono includere `?internal=true` per mostrare tutte le feature
- Soluzione semplice ma non sicura (chiunque può aggiungere il parametro)
```

---

### 3. docs/en/guide/components.md & docs/guide/componenti.md

**LAYOUT DIAGRAM** — Restore Segmented Control and Role Panel:

```
│  Hero Container        │  System Activity    │
│  ├── Segmented Control │  Log                │
│  ├── Role Panel        │                     │
│  └── Survey Panel      │                     │
```

Italian: `Panel Ruolo` instead of `Role Panel`, `Panel Sondaggio` instead of `Survey Panel`.

**SEGMENTED CONTROL** — Re-add section (before Survey Panel):

```markdown
## Segmented Control (Tabs)

**File:** `index.html` — managed by `app.js`

Two tabs with segmented control styling:

| Tab | ID | Panel | Visibility |
|---|---|---|---|
| Role | `tab-ruolo` | `panel-ruolo` | Only with `?internal=true` |
| Survey | `tab-sondaggio` | `panel-sondaggio` | Always visible |

When the Role tab is hidden, the Survey panel is the only one visible and the segmented control is not shown.
```

**ROLE SEARCH PANEL** — Re-add section (before Survey Panel):

```markdown
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
```

**SEARCH SUGGESTIONS MODAL** — Re-add (before Survey Preset Modal):

```markdown
### Search Suggestions Modal

Shows 6 detailed search examples with an explanation of the matching logic:

1. **Addetto alla vendita retail** — Main category (74 offers)
2. **Insegnante scuola dell'infanzia** — Alias (1 offer)
3. **Data Scientist** — Incomplete profile (0 offers)
4. **Influencer** — No match (generic search)
5. **Magazziniere** — Missing skills (60 offers)
6. **Web Marketing Expert** — Double null edge case
```

---

### 4. docs/en/guide/architecture.md & docs/guide/architettura.md

**MODULES** — Restore app.js description:

```
├── js/app.js              → Role search module (IIFE)
# IT: → Modulo ricerca ruoli (IIFE)
```

**INIT SEQUENCE** — Restore step 4:

```
4. app.js (IIFE)
   → Initialises DOM references
   → Loads mansioni_database.json via Fetch
   → Connects search/autocomplete events
   → Manages Role tab visibility (?internal=true)
```

**DATA-DRIVEN UI** — Re-add line:

```
- Roles and their properties (URL, soft skills, mapping type) come from the database
# IT: - Le mansioni e le relative proprietà (URL, soft skills, tipo mapping) vengono dal database
```

**APP.JS SEARCH STATE** — Re-add section (before survey.js state):

```markdown
### app.js — Search State

\```javascript
state = {
    mansioniPadre: [],           // Full array from database
    isDataLoaded: boolean,       // Data loading flag
    activeSuggestionIndex: -1,   // Active suggestion index (keyboard nav)
    currentSuggestions: [],      // Current filtered suggestions
    selectedRole: null,          // User-selected role
    generatedUrl: null,          // Generated URL for the CTA
    currentScenario: null        // 'match' | 'no-match' | null
}
\```
```

**ROLE SEARCH FLOW** — Re-add section (before Survey Flow):

```markdown
### Role Search Flow

\```
User input (typing)
    ↓
Filtering mansioni_database.json (case-insensitive, substring match)
    ↓
Rendering suggestions (max 15) with mapping type badges
    ↓
User selection
    ↓
Scenario determination:
  ├── mapping_type === "categoria_principale" or "alias"
  │   → Green CTA → Specific job offers URL
  ├── mapping_type === "profilo_incompleto"
  │   → Purple CTA → Generic search URL
  └── No match in database
      → Orange CTA → Free search URL
    ↓
Log to System Activity Log
\```
```

**APP.JS CONFIG** — Re-add section (before survey.js config):

```markdown
### app.js

\```javascript
CONFIG = {
    dataUrl: './data/mansioni_database.json',
    searchUrl: 'https://www.gigroup.it/offerte-lavoro/',
    maxSuggestions: 15,
    minQueryLength: 1,
    debounceDelay: 100
}
\```
```

**ACCESSIBILITY** — Restore:

```
- Keyboard navigation in the suggestions dropdown (arrows + Enter + Escape)
# IT: - Navigazione da tastiera nel dropdown suggerimenti (frecce + Enter + Escape)
```

---

### 5. docs/en/guide/database.md & docs/guide/database.md

**SUPABASE WARNING** — Re-add (after intro):

```markdown
::: warning Note on Supabase
Although the project is designed to integrate with Supabase in the post-POC phase,
the current version does not use Supabase. All data is served from static JSON files.
:::
```

**ROLES DATABASE** — Re-add entire section (before Survey Database):

```markdown
## Roles Database

**File:** `data/mansioni_database.json`

### Metadata

| Field | Value |
|---|---|
| Version | 3.0.0 |
| Total entries | 604 |
| Last updated | 2026-02-04 |
| Source | `mansioni-softskills-dude-20260204.xlsx` |

### Entry Schema

\```json
{
  "nome": "string",
  "id": "string",
  "numero_offerte": number,
  "url": "string | null",
  "soft_skills": ["string"] | null,
  "mapping_type": "categoria_principale" | "alias" | "profilo_incompleto",
  "has_custom_skills": boolean
}
\```

| Field | Description |
|---|---|
| `nome` | Role name (canonical title) |
| `id` | Slug (lowercase, hyphens) |
| `numero_offerte` | Number of active offers on gigroup.it |
| `url` | Direct URL to job offers (null for incomplete profiles) |
| `soft_skills` | Array of transferable skills (null if not defined) |
| `mapping_type` | Type of match in the system |
| `has_custom_skills` | Whether it has custom skills in the source database |

### Mapping Types

| Type | Count | Description |
|---|---|---|
| `categoria_principale` | 445 | Direct match with active job offers |
| `alias` | 25 | Alternative name, inherits URL from main category |
| `profilo_incompleto` | 134 | Present in the skills DB but without active offers |

### Soft Skills Distribution

- **277** main categories with defined skills
- **168** main categories without skills
- **125** incomplete profiles with skills
- **9** incomplete profiles without skills
- **35** unique soft skills in the system

### Complete Soft Skills

Reliability, Analysis, Listening, Operational Autonomy, Engagement, Collaboration & Teamwork,
Communication, Concreteness, Decision-Making, Flexibility / Alternative Thinking,
Stress Management, Guidance & Team Leadership, Influence, Initiative, Innovation,
Negotiation, Customer Orientation, Results Orientation, Planning & Organisation,
Problem Solving, Thoroughness, Manual Dexterity, Sense of Belonging, Emotional Stability,
Standing, Spatial Visualisation.
```

---

### 6. docs/en/guide/authentication.md & docs/guide/autenticazione.md

**PUBLIC ACCESS** — Restore list:

```
# EN:
- Role search and matching
- BCB v1.0 Survey
- BCB v2.0 Survey

# IT:
- Ricerca ruoli e matching mansioni
- Survey BCB v1.0
- Survey BCB v2.0
```

**SECURITY WARNING** — Restore POC:

```
# EN: "This is intentional for a POC —"
# IT: "Questo è intenzionale per un POC —"
```

**URL PARAMETERS** — Re-add section (before Roles and Permissions):

```markdown
## URL Parameters

| Parameter | Effect |
|---|---|
| `?internal=true` | Shows the "Role" tab (hidden by default) |

The Role tab is hidden in public access to focus the user on the survey.
Adding `?internal=true` to the URL enables the segmented control with both tabs (Role and Survey).
```

**ROLES AND PERMISSIONS** — Restore table:

```markdown
| Level | Access |
|---|---|
| Public | BCB v1.0 Survey, BCB v2.0, results |
| Internal (`?internal=true`) | All public + Role tab |
| SJT (post password) | All public + SJT v1.0 Survey |
```

---

### 7. docs/en/guide/data-pipeline.md & docs/guide/pipeline-dati.md

Restore POC reference:

```
# EN: "In the POC, a user searching for "Warehouse Worker" sees the aggregated soft skills from all linked roles."
# IT: "Nel POC, un utente che cerca "Magazziniere" vede le soft skill aggregate da tutte le mansioni collegate."
```

---

### 8. docs/en/changelog/index.md & docs/changelog/index.md

Restore "POC footer":

```
# EN: "Changelog and Wiki links in the POC footer point to the current language"
# IT: "i link Changelog e Wiki nel footer del POC puntano alla lingua corrente"
```

---

## Git References

| Reference | Commit | Description |
|---|---|---|
| Last commit WITH Role Search | `4605785` | All Role Search docs intact |
| Removal commit (partial) | `4d56349` | index, decisions, components, architecture |
| Removal commit (remaining) | `16fd5e8` | database, auth, pipeline, changelog |
