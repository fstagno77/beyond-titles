# Panoramica

**Beyond Titles** è un sistema di assessment comportamentale per la Digital Platform di Gi Group, progettato per identificare archetipi professionali tramite survey basate sulle competenze.

## Obiettivi

- Identificare il profilo professionale dell'utente tramite survey comportamentali
- Fornire un'esperienza multilingua (IT/EN) con rilevamento automatico della lingua

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript vanilla (ES6+) |
| **Dati** | File JSON locali caricati via Fetch API |
| **Persistenza** | `localStorage` (lingua, tipo survey) |
| **i18n** | Sistema custom con attributi `data-i18n` e auto-detection lingua browser |
| **Build** | Nessuno — static files pronti al deploy |
| **Docs** | VitePress |

::: info Zero dipendenze runtime
L'applicazione non utilizza framework, librerie CDN o dipendenze esterne. Tutto è implementato in vanilla JavaScript.
:::

## Struttura del Progetto

```
beyond-titles/
├── index.html                    # Pagina principale (SPA)
├── changelog.html                # Pagina changelog
├── css/
│   └── style.css                 # Tutti gli stili (~1500+ righe)
├── js/
│   ├── components.js             # Header, footer, language toggle
│   ├── i18n.js                   # Traduzioni e rilevamento lingua
│   ├── app.js                    # Logica applicazione (~1200 righe)
│   └── survey.js                 # Sistema survey (~1465 righe)
├── data/
│   ├── mansioni_database.json    # Database mansioni (604 voci)
│   └── survey_archetypes.json   # Dati survey (v4.1, Behavioural & Competency-Based)
├── assets/
│   ├── logoBeyondTitles.png      # Logo header
│   └── favicon.jpg               # Favicon
└── docs/                         # Documentazione VitePress
```

## Funzionalità Principali

### 1. Survey Comportamentali

Assessment con 10 domande a risposta singola:

| Survey | Versione | Accesso |
|---|---|---|
| Behavioural & Competency-Based | v4.1 | Libero — **default** |

Il sistema identifica 8 archetipi professionali e restituisce sempre un **singolo archetipo dominante**. In caso di parità, il sistema presenta una domanda tiebreaker condizionale (Q11) con matrice di pesi a numeri primi per una risoluzione matematicamente garantita.

### 2. System Activity Log

Pannello di debug laterale che mostra in tempo reale tutte le operazioni: input utente, logica di matching, routing URL, cambi di stato UI e punteggi live durante le survey.

## Versione Corrente

**v0.18.0** — Ultimo aggiornamento: 23 febbraio 2026
