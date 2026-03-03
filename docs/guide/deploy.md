# Deploy

## Requisiti

Beyond è un'applicazione completamente statica. Per il deploy serve solo un web server in grado di servire file HTML, CSS, JS e JSON.

| Requisito | Dettaglio |
|---|---|
| Server | Qualsiasi server web statico |
| HTTPS | Consigliato (per sicurezza localStorage) |
| Build step | Nessuno — i file sono pronti al deploy |
| Node.js | Non necessario in produzione |
| CDN esterne | Nessuna dipendenza |

## Struttura File da Deployare

```
beyond-titles/
├── index.html
├── changelog.html
├── css/
│   └── style.css
├── js/
│   ├── components.js
│   ├── i18n.js
│   ├── app.js
│   └── survey.js
├── data/
│   ├── mansioni_database.json
│   └── survey_archetypes.json
└── assets/
    ├── logoBeyondTitles.png
    └── favicon.jpg
```

::: tip
La cartella `docs/`, `node_modules/`, `package.json` e i file di configurazione **non** vanno deployati. Servono solo per lo sviluppo locale e la documentazione.
:::

## Configurazione Netlify

Il progetto è deployato su Netlify come sito statico.

### Impostazioni Base

| Parametro | Valore |
|---|---|
| Build command | *(nessuno)* |
| Publish directory | `/` (root del progetto) |
| Branch di deploy | `main` |

### Variabili d'Ambiente

Non sono necessarie variabili d'ambiente per l'applicazione. Tutte le configurazioni sono nei file sorgente:

| Configurazione | Posizione | Valore |
|---|---|---|
| URL dati mansioni | `app.js` → `CONFIG.dataUrl` | `./data/mansioni_database.json` |
| URL ricerca Gi Group | `app.js` → `CONFIG.searchUrl` | `https://www.gigroup.it/offerte-lavoro/` |
| Max suggerimenti | `app.js` → `CONFIG.maxSuggestions` | `15` |

### CORS

Non necessario nella configurazione attuale — tutti i file JSON sono serviti dallo stesso dominio. Se in futuro i dati venissero spostati su un'API esterna, sarà necessario configurare le intestazioni CORS.

## Processo di Deploy

### Deploy Automatico (via Netlify)

1. Push su branch `main`
2. Netlify rileva il cambiamento
3. Pubblica i file statici (nessun build step)
4. Sito live in pochi secondi

### Deploy Manuale

Per deploy su qualsiasi server web:

1. Copiare tutti i file della struttura sopra indicata
2. Assicurarsi che il server serva i file `.json` con `Content-Type: application/json`
3. Verificare che il server supporti la navigazione verso `index.html` e `changelog.html`

## Documentazione (VitePress)

La documentazione ha un processo di build separato.

### Sviluppo Locale

```bash
npm run docs:dev       # Preview su http://localhost:5173
```

### Build Produzione

```bash
npm run docs:build     # Output in docs/.vitepress/dist/
npm run docs:preview   # Preview del build statico
```

Il build della documentazione produce file statici in `docs/.vitepress/dist/` che possono essere deployati separatamente o come sottocartella del sito principale.

## Compatibilità Browser

| Browser | Versione Minima | Note |
|---|---|---|
| Chrome | 51+ | ES6+, Fetch API |
| Firefox | 54+ | ES6+, Fetch API |
| Safari | 10+ | ES6+, Fetch API |
| Edge | 15+ | ES6+, Fetch API |

### API Richieste

- `Fetch API` — Caricamento dati JSON
- `localStorage` — Persistenza preferenze
- `CustomEvent` — Comunicazione tra moduli
- `ES6+ syntax` — Arrow functions, template literals, destructuring
