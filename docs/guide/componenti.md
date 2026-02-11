# Componenti

## Layout Generale

L'applicazione usa un layout a due colonne su desktop (hero + system log) che collassa in colonna singola su mobile (breakpoint: 768px).

```
┌──────────────────────────────────────────────┐
│  Header (logo + language toggle)             │
├────────────────────────┬─────────────────────┤
│                        │                     │
│  Hero Container        │  System Activity    │
│  └── Panel Sondaggio   │  Log                │
│                        │                     │
├────────────────────────┴─────────────────────┤
│  Footer (versione + link changelog)          │
└──────────────────────────────────────────────┘
```

## Header

**File:** `js/components.js`

- Logo Beyond Titles (link a `index.html`)
- Language toggle (IT/EN) con bandiera e codice lingua
- Background: blu Gi Group (`#0056b3`), altezza fissa 64px
- Il toggle emette `CustomEvent('languageChanged')` al cambio lingua

## Pannello Survey

**File:** `js/survey.js`

### Fasi della Survey

Il pannello ha tre stati, mutuamente esclusivi:

#### 1. Intro (`#survey-intro`)
- Titolo e sottotitolo "Beyond Titles"
- Selettore tipo survey (Behavioural & Competency-Based v3.5)
- Pulsante "Inizia"
- Link "Suggerimenti" per aprire la modale preset

#### 2. Domande (`#survey-questions`)
- Barra di progresso con fill animato e testo "Domanda X di 10"
- Container domanda con 4 opzioni radio (single-choice)
- Navigazione: pulsanti "Indietro" e "Avanti" (Avanti disabilitato finché non si seleziona)

#### 3. Risultati (`#survey-results`)
- **Card primaria** — Mostra l'archetipo dominante con colore, claim, descrizione e soft skills
- Pulsante "Rifai il Test"

## System Activity Log

**File:** `js/app.js` e `js/survey.js`

Pannello laterale stile terminale (sfondo scuro, font monospace) che logga in tempo reale:

### Tipi di Entry

| Tipo | Colore | Contenuto |
|---|---|---|
| `INPUT` | — | Azioni utente (digitazione, selezione) |
| `LOGIC` | — | Controlli database, calcoli |
| `ROUTING` | — | Generazione URL, navigazione |
| `UI` | — | Cambi di stato, abilitazione pulsanti |
| `INFO` | — | Inizializzazione, caricamento dati |
| `NOMATCH` | — | Nessun match (formattazione speciale) |
| `SURVEY` | — | Messaggi specifici survey |
| `SCORES TABLE` | — | Tabella punteggi live con barre grafiche |

La tabella punteggi si aggiorna dopo ogni risposta, ordinata per punteggio decrescente.

## Modali

### Modale Preset Survey

Griglia di 8 card archetipo per simulare rapidamente un risultato:

- Click su un archetipo simula il risultato corrispondente
- Auto-chiusura della modale dopo la selezione

### Modale Password SJT

Modale di accesso riservato per la survey SJT v1.0:

- Campo password
- Messaggio errore (nascosto di default)
- Pulsante "Accedi"
- Persistenza auth in localStorage

## Footer

**File:** `js/components.js`

- Testo versione: "Beyond Titles v0.12.0"
- Link al changelog (punta alla documentazione wiki VitePress)
- Iniettato dinamicamente da `components.js` per consistenza tra le pagine

## Design System

### Colori Principali

| Variabile CSS | Valore | Uso |
|---|---|---|
| `--color-primary` | `#0056b3` | Blu Gi Group, header, focus |
| `--color-success` | `#27ae60` | Match trovato, CTA attivo |
| `--color-warning` | `#e67e22` | Nessun match, CTA warning |
| `--color-background` | `#f4f6f8` | Sfondo pagina |
| `--color-surface` | `#ffffff` | Card e pannelli |
| `--color-text-primary` | `#333333` | Testo principale |

### Tipografia

Font stack: `'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

| Token | Valore |
|---|---|
| `--font-size-base` | 16px |
| `--font-size-sm` | 14px |
| `--font-size-lg` | 17px |
| `--font-size-xl` | 24px |

### Spaziatura

Base unit: 4px

| Token | Valore |
|---|---|
| `--spacing-xs` | 4px |
| `--spacing-sm` | 8px |
| `--spacing-md` | 16px |
| `--spacing-lg` | 24px |
| `--spacing-xl` | 32px |

### Breakpoint

- **Mobile:** < 768px (colonna singola)
- **Desktop:** ≥ 768px (due colonne: hero + log)
- **Max width container:** 1200px
