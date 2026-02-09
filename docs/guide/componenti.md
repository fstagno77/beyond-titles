# Componenti

## Layout Generale

L'applicazione usa un layout a due colonne su desktop (hero + system log) che collassa in colonna singola su mobile (breakpoint: 768px).

```
┌──────────────────────────────────────────────┐
│  Header (logo + language toggle)             │
├────────────────────────┬─────────────────────┤
│                        │                     │
│  Hero Container        │  System Activity    │
│  ├── Segmented Control │  Log                │
│  ├── Panel Ruolo       │                     │
│  └── Panel Sondaggio   │                     │
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

## Segmented Control (Tab)

**File:** `index.html` — gestito da `app.js`

Due tab con stile segmented control:

| Tab | ID | Pannello | Visibilità |
|---|---|---|---|
| Ruolo | `tab-ruolo` | `panel-ruolo` | Solo con `?internal=true` |
| Sondaggio | `tab-sondaggio` | `panel-sondaggio` | Sempre visibile |

Quando il tab Ruolo è nascosto, il pannello Sondaggio è l'unico visibile e il segmented control non viene mostrato.

## Pannello Ricerca Ruoli

**File:** `js/app.js`

### Componenti

- **Input di ricerca** — Campo testo con placeholder, bordo colorato in base allo stato
- **Pulsante clear** (×) — Visibile quando c'è testo, resetta tutto lo stato
- **Dropdown suggerimenti** — Lista scrollabile (max 280px), max 15 risultati
- **Messaggio di stato** — Mostra tipo di mapping e soft skills del ruolo selezionato
- **CTA Button** — Pulsante azione principale con 4 stati

### Stati Input

| Stato | Bordo | Descrizione |
|---|---|---|
| Default | Grigio | Nessun input |
| Focus | Blu (`#0056b3`) | Input attivo |
| No Match | Arancione (`#e67e22`) | Nessuna corrispondenza trovata |

### Stati CTA

| Stato | Colore | Testo |
|---|---|---|
| Disabilitato | Grigio | — |
| Match attivo | Verde (`#27ae60`) | "Abbiamo XX offerte per te" |
| Profilo incompleto | Viola (`#9b59b6`) | "Nessuna offerta attiva" |
| Nessun match | Arancione (`#e67e22`) | "Scopri tutte le offerte" |

### Badge Suggerimenti

Ogni suggerimento nel dropdown mostra un badge colorato:

| Tipo | Colore badge | Testo |
|---|---|---|
| `categoria_principale` | Blu (`#0056b3`) | Principale |
| `alias` | Azzurro (`#3498db`) | Alias |
| `profilo_incompleto` | Viola (`#9b59b6`) | Incompleto |

## Pannello Survey

**File:** `js/survey.js`

### Fasi della Survey

Il pannello ha tre stati, mutuamente esclusivi:

#### 1. Intro (`#survey-intro`)
- Titolo e sottotitolo "Beyond Titles"
- Selettore tipo survey (Behavioural & Competency-Based v3.4)
- Pulsante "Inizia il Sondaggio"
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

### Modale Suggerimenti Ricerca

Mostra 6 esempi dettagliati di ricerca con spiegazione della logica di matching:

1. **Addetto alla vendita retail** — Categoria principale (74 offerte)
2. **Insegnante scuola dell'infanzia** — Alias (1 offerta)
3. **Data Scientist** — Profilo incompleto (0 offerte)
4. **Influencer** — Nessun match (ricerca generica)
5. **Magazziniere** — Skills mancanti (60 offerte)
6. **Web Marketing Expert** — Caso limite double null

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
