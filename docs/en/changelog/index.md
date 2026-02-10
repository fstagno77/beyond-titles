# Changelog

Project change log, organised by version and date.

## v0.14.0 <Badge type="tip" text="current" />

**10 February 2026**

- **Multilingual wiki**: added complete English version of the documentation (11 translated pages)
- **Wiki dark-only**: forced dark theme, removed light/dark toggle
- **Language switcher** in the wiki navbar to switch between Italiano and English
- **AI Disclaimer**: informational modal on first visit to the English section, with "Don't show again" checkbox
- **Dynamic wiki links**: Changelog and Wiki links in the POC footer point to the current language (IT/EN)
- Localised wiki search (Cerca / Search)

## v0.13.0

**9 February 2026**

- **Survey v3.4**: linguistic refinements on 23 options/stems to maximise clarity and naturalness
- New CTA: **"Start the Journey"** (replaces "Start the Survey")
- New survey introductory text: narrative and reassuring tone of voice
- Removed CSS blend result (no longer used)
- EN translations updated for all v3.4 changes
- Wiki updated with v3.3 → v3.4 corrections table

## v0.12.2

**9 February 2026**

- Renamed survey from "Human Skills Survey" to **Behavioural & Competency-Based** everywhere
- **Legacy survey cleanup**: removed BCB v1.0, BCB v2.0, SJT v1.0
- Removed "Survey type" dropdown, added static survey version label
- Removed SJT password system and obsolete survey translations
- Added Behavioural & Competency-Based wiki page
- Added **Wiki** link in the footer
- Added **SubSense** logo in the wiki sidebar

## v0.12.0

**8 February 2026**

- Added **Behavioural & Competency-Based v3.0** survey with 10 reformulated questions
- Complete IT/EN translations
- Set as **default survey**
- Updated survey intro subtitle ("What makes you unique?")
- Changelog link in footer now points to **wiki documentation** (VitePress)

## v0.9.1

**21 January 2026**

- **Full i18n for survey**: all questions and answers translated to IT/EN
- Archetype names translated in the System Log scores table
- System Log messages translated (start, completion, survey simulation)
- Browser language detection logic refinement

## v0.9.0

**20 January 2026**

- **Scoring redesign**: from binary MORE/LESS system to **single-choice** (one answer per question)
- 10 behavioural questions with balanced mapping (5 occurrences per archetype)
- Result always **clear-cut**: a single dominant archetype
- Deterministic tie-break by alphabetical order in case of tie
- Removed special Q10 tie-break (now a standard question)
- Confidence index rounded to multiples of 5%
- Re-render survey results on language change
- Survey intro rebranding with Beyond Titles subtitle

## v0.8.0

**19 January 2026**

- Introduced **Professional Archetypes Survey** system with 10 behavioural questions
- MORE/LESS (binary) scoring with single dominant archetype
- Defined **8 professional archetypes**: Connector, Strategist, Pragmatist, Collaborator, Resolver, Pioneer, Captain, Craftsman
- **Suggestions** modal for quick result simulation
- **Live scores table** in the System Activity Log with graphical bars
- Preset modal with 8 archetype grid

## v0.7.1

**13 January 2026**

- Added **Clear button** (×) in the search field
- Full interface state reset on click

## v0.7.0

**13 January 2026**

- Migration to **Database v4** with 604 total roles (+159 compared to v0.5)
- New mapping type: **profilo_incompleto** for roles without active offers (134 entries)
- Null URL handling: automatic fallback to generic search
- Null soft_skills handling: 9 roles without defined competencies
- New **purple** CTA state for incomplete profiles
- Added `has_custom_skills` flag in the database schema
- CTA label update

## v0.6.3

**12 January 2026**

- Header structure refactoring
- **Multilingual** changelog (IT/EN)
- Language toggle alignment fix

## v0.6.2

**12 January 2026**

- Header/footer alignment fix
- **Centralisation** of header and footer management in `components.js`

## v0.6.0

**11 January 2026**

- Implemented **full i18n system** (Italian/English)
- **Auto-detection** of browser language (`navigator.language`)
- Manual language toggle with localStorage persistence
- Complete translation of all UI strings

## v0.5.0

**10 January 2026**

- New `mansioni_database.json` with **445 positions**
- **3-level** mapping system: Main Category → Alias → Fallback
- **Soft skills integration**: transferable competencies read from database (not generated)
- **Direct URLs**: links to offers read from database (not constructed)
- Database statistics shown on load

## v0.4.0

**17 December 2025**

- Added **job offer count** per position in database
- Dynamic CTAs: "We have XX job offers for you"
- Updated JSON structure with `{nome, jobOffers}` objects

## v0.3.0

**17 December 2025**

- **Scenario 3** (No Match): free search with Enter key handling
- **Orange** UI state for no match
- Search URL generation with `?job=` parameter
- **Beyond Titles** logo in the header

## v0.2.0

**17 December 2025**

- **Scenario 1** (Unique Match): deep link to job offers
- **CTA** button with direct link
- **System Activity Log**: debug panel with real-time logging
- Log types: INPUT, LOGIC, ROUTING, UI
- **Two-column** responsive layout (hero + log)

## v0.1.0

**17 December 2025**

- **Initial MVP**: modular project structure (separate HTML/CSS/JS)
- External JSON database for roles
- Asynchronous data loading via Fetch API
- **Autocomplete** with highlighting and keyboard navigation
- Favicon
