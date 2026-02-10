# Panoramica

**Beyond Titles** è un POC (Proof of Concept) per la Digital Platform di Gi Group. L'applicazione consente il matching intelligente tra titoli professionali e offerte di lavoro, combinato con un sistema di assessment comportamentale per l'identificazione di archetipi professionali.

## Obiettivi

- Matchare i job title inseriti dall'utente con un database di mansioni e offerte attive
- Identificare il profilo professionale dell'utente tramite survey comportamentali
- Fornire un'esperienza multilingua (IT/EN) con rilevamento automatico della lingua

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript vanilla (ES6+) |
| **Dati** | File JSON locali caricati via Fetch API |
| **Persistenza** | `localStorage` (lingua, auth SJT, tipo survey) |
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
│   ├── app.js                    # Ricerca ruoli e autocomplete (~1200 righe)
│   └── survey.js                 # Sistema survey (~1465 righe)
├── data/
│   ├── mansioni_database.json    # Database mansioni (604 voci)
│   └── survey_archetypes.json   # Dati survey (v3.4, Behavioural & Competency-Based)
├── assets/
│   ├── logoBeyondTitles.png      # Logo header
│   └── favicon.jpg               # Favicon
└── docs/                         # Documentazione VitePress
```

## Funzionalità Principali

### 1. Ricerca Ruoli (Role Matching)

L'utente digita un titolo professionale e il sistema cerca corrispondenze nel database di 604 mansioni. Tre scenari possibili:

- **Match diretto** (categoria principale o alias) → CTA verde con link alle offerte
- **Profilo incompleto** (mansione senza offerte attive) → CTA viola con ricerca generica
- **Nessun match** → CTA arancione con ricerca libera su gigroup.it

### 2. Survey Comportamentali

Assessment con 10 domande a risposta singola:

| Survey | Versione | Accesso |
|---|---|---|
| Behavioural & Competency-Based | v3.4 | Libero — **default** |

Il sistema identifica 8 archetipi professionali e restituisce sempre un **singolo archetipo dominante**. In caso di parità, il tie-break è deterministico (ordine alfabetico).

### 3. System Activity Log

Pannello di debug laterale che mostra in tempo reale tutte le operazioni: input utente, logica di matching, routing URL, cambi di stato UI e punteggi live durante le survey.

## Versione Corrente

**v0.14.0** — Ultimo aggiornamento: 10 febbraio 2026
