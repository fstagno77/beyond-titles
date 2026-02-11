# Deploy

## Requirements

Beyond Titles is a fully static application. For deployment, only a web server capable of serving HTML, CSS, JS and JSON files is needed.

| Requirement | Detail |
|---|---|
| Server | Any static web server |
| HTTPS | Recommended (for localStorage security) |
| Build step | None — files are ready to deploy |
| Node.js | Not needed in production |
| External CDNs | No dependencies |

## File Structure to Deploy

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
The `docs/`, `node_modules/`, `package.json` folders and configuration files should **not** be deployed. They are only needed for local development and documentation.
:::

## Netlify Configuration

The project is deployed on Netlify as a static site.

### Base Settings

| Parameter | Value |
|---|---|
| Build command | *(none)* |
| Publish directory | `/` (project root) |
| Deploy branch | `main` |

### Environment Variables

No environment variables are needed for the application. All configurations are in the source files:

| Configuration | Location | Value |
|---|---|---|
| Roles data URL | `app.js` → `CONFIG.dataUrl` | `./data/mansioni_database.json` |
| Gi Group search URL | `app.js` → `CONFIG.searchUrl` | `https://www.gigroup.it/offerte-lavoro/` |
| Max suggestions | `app.js` → `CONFIG.maxSuggestions` | `15` |

### CORS

Not needed in the current configuration — all JSON files are served from the same domain. If data is moved to an external API in the future, CORS headers will need to be configured.

## Deploy Process

### Automatic Deploy (via Netlify)

1. Push to `main` branch
2. Netlify detects the change
3. Publishes static files (no build step)
4. Site live in seconds

### Manual Deploy

To deploy on any web server:

1. Copy all files from the structure above
2. Ensure the server serves `.json` files with `Content-Type: application/json`
3. Verify the server supports navigation to `index.html` and `changelog.html`

## Documentation (VitePress)

The documentation has a separate build process.

### Local Development

```bash
npm run docs:dev       # Preview at http://localhost:5173
```

### Production Build

```bash
npm run docs:build     # Output in docs/.vitepress/dist/
npm run docs:preview   # Preview of the static build
```

The documentation build produces static files in `docs/.vitepress/dist/` that can be deployed separately or as a subfolder of the main site.

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome | 51+ | ES6+, Fetch API |
| Firefox | 54+ | ES6+, Fetch API |
| Safari | 10+ | ES6+, Fetch API |
| Edge | 15+ | ES6+, Fetch API |

### Required APIs

- `Fetch API` — JSON data loading
- `localStorage` — Preferences persistence
- `CustomEvent` — Inter-module communication
- `ES6+ syntax` — Arrow functions, template literals, destructuring
