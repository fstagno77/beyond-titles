# Architettura

## Panoramica

Beyond Titles è una Single Page Application (SPA) statica, senza framework e senza build step. L'architettura segue un pattern modulare basato su file JavaScript separati per responsabilità, con stato gestito localmente in ciascun modulo tramite IIFE (Immediately Invoked Function Expression).

## Moduli

```
index.html
  ├── css/style.css          → Design system e stili componenti
  ├── js/components.js       → Header, footer, language toggle
  ├── js/i18n.js             → Traduzioni e rilevamento lingua
  ├── js/app.js              → Modulo ricerca ruoli (IIFE)
  └── js/survey.js           → Modulo survey (IIFE)
```

### Sequenza di Inizializzazione

```
1. DOM Content Loaded
   ↓
2. components.js
   → Renderizza header (logo + language toggle)
   → Renderizza footer (versione + link changelog)
   → Inizializza event listeners
   ↓
3. i18n.js
   → Rileva lingua (localStorage → browser → fallback 'en')
   → Crea istanza globale window.i18n
   ↓
4. app.js (IIFE)
   → Inizializza riferimenti DOM
   → Carica mansioni_database.json via Fetch
   → Collega eventi search/autocomplete
   → Gestisce visibilità tab Ruolo (?internal=true)
   ↓
5. survey.js (IIFE)
   → Carica survey_archetypes.json via Fetch
   → Inizializza selettore survey
   → Configura modale password SJT
```

## Pattern Utilizzati

### IIFE per Incapsulamento

Sia `app.js` che `survey.js` usano IIFE per evitare inquinamento del namespace globale:

```javascript
(function() {
    const state = { /* stato locale del modulo */ };
    const CONFIG = { /* configurazione */ };
    // ... logica del modulo
})();
```

### Event-Driven Communication

I moduli comunicano tramite `CustomEvent` sul DOM:

- `languageChanged` — emesso da `i18n.js` quando l'utente cambia lingua, ascoltato da tutti i moduli per aggiornare le traduzioni

### Data-Driven UI

L'interfaccia è guidata interamente dai dati JSON:

- Le mansioni e le relative proprietà (URL, soft skills, tipo mapping) vengono dal database
- Le domande, opzioni, pesi e definizioni degli archetipi vengono dal file survey

## Gestione dello Stato

### app.js — Stato Ricerca

```javascript
state = {
    mansioniPadre: [],           // Array completo dal database
    isDataLoaded: boolean,       // Flag caricamento dati
    activeSuggestionIndex: -1,   // Indice suggerimento attivo (keyboard nav)
    currentSuggestions: [],      // Suggerimenti correnti filtrati
    selectedRole: null,          // Ruolo selezionato dall'utente
    generatedUrl: null,          // URL generato per il CTA
    currentScenario: null        // 'match' | 'no-match' | null
}
```

### survey.js — Stato Survey

```javascript
state = {
    surveyData: {},              // Contenuto survey_archetypes.json
    selectedSurvey: string,      // 'bcb_v3'
    currentQuestion: 0,          // Indice domanda corrente (0-9)
    answers: [],                 // Array risposte utente
    scores: {}                   // { nomeArchetipo: punteggioAccumulato }
}
```

### localStorage

| Chiave | Valore | Modulo |
|---|---|---|
| `beyond-titles-lang` | `'it'` o `'en'` | i18n.js |
| `beyond-titles-survey-type` | `'bcb_v3'` | survey.js |

## Flussi Dati

### Flusso Ricerca Ruoli

```
Input utente (digitazione)
    ↓
Filtraggio mansioni_database.json (case-insensitive, substring match)
    ↓
Rendering suggerimenti (max 15) con badge tipo mapping
    ↓
Selezione utente
    ↓
Determinazione scenario:
  ├── mapping_type === "categoria_principale" o "alias"
  │   → CTA verde → URL offerte specifiche
  ├── mapping_type === "profilo_incompleto"
  │   → CTA viola → URL ricerca generica
  └── Nessun match nel database
      → CTA arancione → URL ricerca libera
    ↓
Log nel System Activity Log
```

### Flusso Survey

```
Selezione tipo survey → [Eventuale password SJT]
    ↓
Per ciascuna delle 10 domande:
  → Utente seleziona 1 opzione (single-choice)
  → Accumulo punteggio: scores[archetipo] += peso
  → Aggiornamento tabella punteggi live nel log
    ↓
Calcolo risultati:
  → Ranking archetipi per punteggio (tie-break: ordine alfabetico)
  → Sempre profilo netto: un singolo archetipo dominante
    ↓
Rendering risultati:
  → Card primaria con archetipo, claim, profilo e soft skills
```

## Configurazioni

### app.js

```javascript
CONFIG = {
    dataUrl: './data/mansioni_database.json',
    searchUrl: 'https://www.gigroup.it/offerte-lavoro/',
    maxSuggestions: 15,
    minQueryLength: 1,
    debounceDelay: 100
}
```

### survey.js

```javascript
CONFIG = {
    W_BAR: <peso medio>,
    SJT_PASSWORD: 'gigroup2026'
}
```

## Accessibilità

- Attributi ARIA su tutti i controlli interattivi (`role="tablist"`, `role="tabpanel"`, `role="listbox"`, `role="log"`, `role="dialog"`)
- Navigazione da tastiera nel dropdown suggerimenti (frecce + Enter + Escape)
- Focus management nei modali
- Funzione `escapeHtml()` per prevenzione XSS
