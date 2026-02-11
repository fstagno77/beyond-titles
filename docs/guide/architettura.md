# Architettura

## Panoramica

Beyond Titles è una Single Page Application (SPA) statica, senza framework e senza build step. L'architettura segue un pattern modulare basato su file JavaScript separati per responsabilità, con stato gestito localmente in ciascun modulo tramite IIFE (Immediately Invoked Function Expression).

## Moduli

```
index.html
  ├── css/style.css          → Design system e stili componenti
  ├── js/components.js       → Header, footer, language toggle
  ├── js/i18n.js             → Traduzioni e rilevamento lingua
  ├── js/app.js              → Modulo applicazione (IIFE)
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
   → Carica dati applicazione via Fetch
   → Collega event listeners
   ↓
5. survey.js (IIFE)
   → Carica survey_archetypes.json via Fetch
   → Inizializza UI survey
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

- Le domande, opzioni, pesi e definizioni degli archetipi vengono dal file survey

## Gestione dello Stato

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

### Flusso Survey

```
Avvio survey
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

### survey.js

```javascript
CONFIG = {
    W_BAR: <peso medio>
}
```

## Accessibilità

- Attributi ARIA su tutti i controlli interattivi (`role="tablist"`, `role="tabpanel"`, `role="listbox"`, `role="log"`, `role="dialog"`)
- Navigazione da tastiera (frecce + Enter + Escape)
- Focus management nei modali
- Funzione `escapeHtml()` per prevenzione XSS
